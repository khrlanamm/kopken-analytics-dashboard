import os
import re
import pandas as pd
import numpy as np
import joblib

ASPECT_KEYWORDS = {
    'aspek_rasa': ['kopi', 'minuman', 'rasa', 'enak', 'pahit', 'manis', 'es', 'susu', 'roti', 'menu', 'cup', 'kualitas', 'asin', 'gurih', 'cokelat', 'latte', 'matcha', 'boba', 'tawar', 'encer', 'pekat', 'panas', 'dingin'],
    'aspek_harga': ['harga', 'mahal', 'murah', 'promo', 'diskon', 'cashback', 'ovo', 'gopay', 'shopeepay', 'worth', 'hemat', 'paket', 'voucher', 'poin', 'reward', 'points', 'point', 'vocher', 'vocr', 'dana', 'qris', 'linkaja'],
    'aspek_aplikasi': ['app', 'aplikasi', 'order', 'pesan', 'sistem', 'down', 'error', 'apk', 'bug', 'crash', 'lag', 'login', 'logout', 'update', 'notif', 'ui', 'tampilan', 'lemot', 'macet', 'otp', 'sms', 'keluar', 'masuk', 'loading', 'pemuatan', 'uninstall', 'uninstal', 'copot'],
    'aspek_pelayanan': ['cs', 'customer', 'service', 'komplain', 'respon', 'balas', 'admin', 'pelayanan', 'staff', 'karyawan', 'ramah', 'sopan', 'jutek', 'barista', 'kasir'],
    'aspek_kecepatan': ['lama', 'cepat', 'antri', 'nunggu', 'lambat', 'tunggu', 'antrean', 'gercep', 'lelet', 'durasi', 'menit', 'jam', 'telat', 'keterlambatan'],
    'aspek_stok': ['habis', 'stok', 'menu', 'sedia', 'kosong', 'varian', 'kehabisan', 'ready', 'sold', 'out'],
    'aspek_pengiriman': ['kurir', 'driver', 'gojek', 'grab', 'lalamove', 'kirim', 'tumpah', 'packaging', 'kemasan', 'bocor', 'solasi', 'segel'],
    'aspek_pesanan': ['salah', 'kurang', 'tidak sesuai', 'beda', 'cancel', 'refund', 'batal', 'kembali uang', 'salah pesanan']
}

def load_lexicon(base_dir):
    project_root = os.path.dirname(os.path.dirname(base_dir))
    pos_path = os.path.join(project_root, "modeling", "data", "positive.tsv")
    neg_path = os.path.join(project_root, "modeling", "data", "negative.tsv")
    
    lexicon = {}
    if os.path.exists(pos_path) and os.path.exists(neg_path):
        try:
            pos_df = pd.read_csv(pos_path, sep='\t')
            neg_df = pd.read_csv(neg_path, sep='\t')
            for _, row in pos_df.iterrows():
                lexicon[str(row['word']).lower()] = float(row['weight'])
            for _, row in neg_df.iterrows():
                lexicon[str(row['word']).lower()] = float(row['weight'])
            print(f"Lexicon loaded successfully. Total {len(lexicon)} words.")
        except Exception as e:
            print(f"[WARN] Failed to load lexicon: {e}")
    else:
        print(f"[ERROR] Lexicon files not found at {pos_path} or {neg_path}!")
    return lexicon

def split_into_clauses(text):
    if not isinstance(text, str):
        return []
    parts = re.split(r'[.,;!?\n]+', text)
    clauses = []
    for p in parts:
        subparts = re.split(r'\b(tapi|namun|tetapi|sedangkan|padahal|meskipun|walaupun|lalu|kemudian)\b', p, flags=re.IGNORECASE)
        clauses.extend([sp.strip() for sp in subparts if sp.strip()])
    return clauses

def get_sentiment_for_clause(clause_text, lexicon):
    words = str(clause_text).lower().split()
    score = sum(lexicon.get(w, 0.0) for w in words)
    if score > 0:
        return 'positive'
    elif score < 0:
        return 'negative'
    else:
        return 'neutral'

def run_absa_inference(texts, original_texts, aspect_model, tfidf_vectorizer, indobert_model, indobert_tokenizer, lexicon):
    aspect_cols = list(ASPECT_KEYWORDS.keys())
    pred_aspects = np.zeros((len(texts), len(aspect_cols)), dtype=int)
    
    # 1. Try IndoBERT if loaded
    if indobert_model is not None and indobert_tokenizer is not None:
        try:
            print("Predicting aspects using IndoBERT model...")
            import torch
            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            indobert_model.to(device)
            indobert_model.eval()
            
            batch_size = 32
            predictions = []
            with torch.no_grad():
                for i in range(0, len(texts), batch_size):
                    batch_texts = list(texts[i:i+batch_size])
                    inputs = indobert_tokenizer(
                        batch_texts, 
                        padding=True, 
                        truncation=True, 
                        max_length=128, 
                        return_tensors="pt"
                    ).to(device)
                    
                    outputs = indobert_model(**inputs)
                    probs = torch.sigmoid(outputs.logits).cpu().numpy()
                    predictions.append(probs)
                    
            probs_all = np.vstack(predictions)
            pred_aspects = (probs_all >= 0.5).astype(int)
            print("IndoBERT aspect prediction completed.")
        except Exception as e:
            print(f"[WARN] IndoBERT prediction failed: {e}. Falling back to SVM/keywords.")
            indobert_model = None
            
    # 2. Try SVM if IndoBERT is not loaded/failed
    if indobert_model is None and aspect_model is not None and tfidf_vectorizer is not None:
        try:
            print("Predicting aspects using SVM model...")
            features = tfidf_vectorizer.transform(texts)
            pred_aspects = aspect_model.predict(features)
            print("SVM aspect prediction completed.")
        except Exception as e:
            print(f"[WARN] SVM prediction failed: {e}. Falling back to keyword matching.")
            aspect_model = None
            
    # 3. Fallback to keyword matching
    if indobert_model is None and aspect_model is None:
        print("Predicting aspects using fallback keyword matching...")
        for i, text in enumerate(texts):
            text_lower = str(text).lower()
            for j, (aspect, kws) in enumerate(ASPECT_KEYWORDS.items()):
                if any(kw in text_lower for kw in kws):
                    pred_aspects[i, j] = 1

    results = []
    for i in range(len(texts)):
        row_res = {}
        text_clean = str(texts[i])
        orig_text = str(original_texts[i])
        clauses = split_into_clauses(orig_text)
        
        for j, aspect in enumerate(aspect_cols):
            row_res[aspect] = int(pred_aspects[i, j])
            sent_col = aspect.replace('aspek_', 'sentimen_')
            
            if pred_aspects[i, j] == 1:
                kws = ASPECT_KEYWORDS[aspect]
                matched_clauses = [c for c in clauses if any(kw in c.lower() for kw in kws)]
                target_text = " ".join(matched_clauses) if matched_clauses else text_clean
                row_res[sent_col] = get_sentiment_for_clause(target_text, lexicon)
            else:
                row_res[sent_col] = 'None'
                
        results.append(row_res)
        
    return pd.DataFrame(results)

def main():
    print("=== Running App Reviews ABSA Inference Pipeline ===")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Paths setup
    dataset_path = os.path.join(base_dir, "..", "preprocessing", "cleaned_app_reviews.csv")
    model_path = os.path.join(base_dir, "weights", "aspect_classifier_svm.pkl")
    vectorizer_path = os.path.join(base_dir, "weights", "tfidf_vectorizer_aspect.pkl")
    indobert_path = os.path.join(base_dir, "weights", "indobert_aspect_multilabel")
    
    lexicon = load_lexicon(base_dir)
    
    # Try loading IndoBERT model
    indobert_model = None
    indobert_tokenizer = None
    if os.path.exists(indobert_path):
        print(f"Loading IndoBERT model from {indobert_path}...")
        try:
            from transformers import AutoTokenizer, AutoModelForSequenceClassification
            import torch
            indobert_model = AutoModelForSequenceClassification.from_pretrained(indobert_path)
            indobert_tokenizer = AutoTokenizer.from_pretrained(indobert_path)
            print("IndoBERT model loaded successfully.")
        except Exception as e:
            print(f"[WARN] Failed to load IndoBERT model: {e}. Falling back to SVM baseline.")
            
    # Try loading SVM model if IndoBERT not found or failed
    aspect_model = None
    tfidf_vectorizer = None
    if indobert_model is None:
        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            print(f"Loading SVM model from {model_path}...")
            try:
                aspect_model = joblib.load(model_path)
                tfidf_vectorizer = joblib.load(vectorizer_path)
                print("SVM model loaded successfully.")
            except Exception as e:
                print(f"[WARN] Failed to load SVM model: {e}. Falling back to keyword matching.")
        else:
            print("[INFO] SVM model not found. Using fallback keyword matching.")

    if os.path.exists(dataset_path):
        print(f"Loading dataset from {dataset_path}...")
        df = pd.read_csv(dataset_path).dropna(subset=['text_clean', 'review_text'])
        print(f"Loaded {len(df)} reviews.")
        
        print("Running ABSA batch inference...")
        absa_df = run_absa_inference(
            df['text_clean'].values, 
            df['review_text'].values, 
            aspect_model, 
            tfidf_vectorizer, 
            indobert_model,
            indobert_tokenizer,
            lexicon
        )
        
        df_out = pd.concat([df.reset_index(drop=True), absa_df], axis=1)
        
        data_dir = os.path.join(base_dir, "data")
        os.makedirs(data_dir, exist_ok=True)
        
        df_out.to_csv(os.path.join(data_dir, 'aspect_analysis_app.csv'), index=False)
        
        cols_compact = ['username', 'review_text', 'text_clean', 'rating', 'date', 'app_version', 'platform']
        aspect_cols = list(ASPECT_KEYWORDS.keys())
        sentiment_cols = [a.replace('aspek_', 'sentimen_') for a in aspect_cols]
        
        df_out[cols_compact + aspect_cols + sentiment_cols].to_csv(
            os.path.join(data_dir, 'predictions_app.csv'), 
            index=False
        )
        print("Inference completed and files exported successfully.")
    else:
        print(f"[WARN] Dataset {dataset_path} not found.")

    # Unit testing
    print("\n=== Running Unit Test ===")
    test_reviews = [
        "Aplikasi sering crash pas mau checkout pesanan kopi gula aren, untung dapet voucher promo diskon",
        "Kopinya enak manis pas, tapi driver pengirimannya lelet tumpah lagi kopinya di kantong",
        "Kecewa banget CS nya jutek respon lambat dan stok boba selalu kosong di app"
    ]
    test_clean = [
        "aplikasi crash checkout pesan kopi gula aren untung voucher promo diskon",
        "kopi enak manis pas driver kirim lelet tumpah kopi kantong",
        "kecewa banget cs jutek respon lambat stok boba kosong app"
    ]
    
    test_res = run_absa_inference(test_clean, test_reviews, aspect_model, tfidf_vectorizer, indobert_model, indobert_tokenizer, lexicon)
    for i in range(len(test_reviews)):
        print(f"\nReview: \"{test_reviews[i]}\"")
        for aspect in ASPECT_KEYWORDS.keys():
            if test_res.loc[i, aspect] == 1:
                sent_col = aspect.replace('aspek_', 'sentimen_')
                print(f"  -> Aspek: {aspect.replace('aspek_', '').upper()} | Sentimen: {test_res.loc[i, sent_col].upper()}")
                
    print("\nInference Pipeline Finished.")

if __name__ == '__main__':
    main()
