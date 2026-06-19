import os
import re
import pandas as pd
import numpy as np

def run_absa():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "..", "data", "cleaned_app_reviews_with_aspect_labels.csv")
    
    print(f"Loading labeled reviews from {dataset_path}...")
    # Read reviews, make sure we use review_text as it has clauses
    df = pd.read_csv(dataset_path).dropna(subset=['text_clean', 'review_text'])
    print(f"Loaded {len(df)} rows.")
    
    # Load lexicon
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(base_dir)))
    pos_path = os.path.join(project_root, "modeling", "data", "positive.tsv")
    neg_path = os.path.join(project_root, "modeling", "data", "negative.tsv")
    
    if os.path.exists(pos_path) and os.path.exists(neg_path):
        pos_df = pd.read_csv(pos_path, sep='\t')
        neg_df = pd.read_csv(neg_path, sep='\t')
        
        lexicon = {}
        for _, row in pos_df.iterrows():
            lexicon[str(row['word']).lower()] = float(row['weight'])
        for _, row in neg_df.iterrows():
            lexicon[str(row['word']).lower()] = float(row['weight'])
        print(f"Lexicon loaded. Total {len(lexicon)} words.")
    else:
        print(f"[ERROR] Lexicon files not found at {pos_path} or {neg_path}!")
        return

    aspect_keywords = {
        'aspek_rasa': ['kopi', 'minuman', 'rasa', 'enak', 'pahit', 'manis', 'es', 'susu', 'roti', 'menu', 'cup', 'kualitas', 'asin', 'gurih', 'cokelat', 'latte', 'matcha', 'boba', 'tawar', 'encer', 'pekat', 'panas', 'dingin'],
        'aspek_harga': ['harga', 'mahal', 'murah', 'promo', 'diskon', 'cashback', 'ovo', 'gopay', 'shopeepay', 'worth', 'hemat', 'paket', 'voucher', 'poin', 'reward', 'points', 'point', 'vocher', 'vocr', 'dana', 'qris', 'linkaja'],
        'aspek_aplikasi': ['app', 'aplikasi', 'order', 'pesan', 'sistem', 'down', 'error', 'apk', 'bug', 'crash', 'lag', 'login', 'logout', 'update', 'notif', 'ui', 'tampilan', 'lemot', 'macet', 'otp', 'sms', 'keluar', 'masuk', 'loading', 'pemuatan', 'uninstall', 'uninstal', 'copot'],
        'aspek_pelayanan': ['cs', 'customer', 'service', 'komplain', 'respon', 'balas', 'admin', 'pelayanan', 'staff', 'karyawan', 'ramah', 'sopan', 'jutek', 'barista', 'kasir'],
        'aspek_kecepatan': ['lama', 'cepat', 'antri', 'nunggu', 'lambat', 'tunggu', 'antrean', 'gercep', 'lelet', 'durasi', 'menit', 'jam', 'telat', 'keterlambatan'],
        'aspek_stok': ['habis', 'stok', 'menu', 'sedia', 'kosong', 'varian', 'kehabisan', 'ready', 'sold', 'out'],
        'aspek_pengiriman': ['kurir', 'driver', 'gojek', 'grab', 'lalamove', 'kirim', 'tumpah', 'packaging', 'kemasan', 'bocor', 'solasi', 'segel'],
        'aspek_pesanan': ['salah', 'kurang', 'tidak sesuai', 'beda', 'cancel', 'refund', 'batal', 'kembali uang', 'salah pesanan']
    }

    def split_into_clauses(text):
        if not isinstance(text, str):
            return []
        parts = re.split(r'[.,;!?\n]+', text)
        clauses = []
        for p in parts:
            subparts = re.split(r'\b(tapi|namun|tetapi|sedangkan|padahal|meskipun|walaupun|lalu|kemudian)\b', p, flags=re.IGNORECASE)
            clauses.extend([sp.strip() for sp in subparts if sp.strip()])
        return clauses

    def calculate_lexicon_score(text, lexicon_dict):
        words = str(text).lower().split()
        score = 0.0
        for word in words:
            if word in lexicon_dict:
                score += lexicon_dict[word]
        return score

    def get_aspect_sentiment(row, aspect_name, keywords, lexicon_dict):
        if row[aspect_name] == 0:
            return "None"
        
        original_text = row['review_text']
        clauses = split_into_clauses(original_text)
        kws = keywords[aspect_name]
        
        # Filter clauses matching aspect keywords
        matched_clauses = [c for c in clauses if any(kw in c.lower() for kw in kws)]
        
        # Fallback to cleaned text if no specific matching clause is found
        target_text = " ".join(matched_clauses) if matched_clauses else row['text_clean']
        score = calculate_lexicon_score(target_text, lexicon_dict)
        
        if score > 0:
            return "positive"
        elif score < 0:
            return "negative"
        else:
            return "neutral"

    print("Calculating aspect-level sentiment...")
    for aspect in aspect_keywords.keys():
        sentiment_col = aspect.replace('aspek_', 'sentimen_')
        df[sentiment_col] = df.apply(
            lambda row: get_aspect_sentiment(row, aspect, aspect_keywords, lexicon), 
            axis=1
        )
    print("Scoring completed!")
    
    for aspect in aspect_keywords.keys():
        sentiment_col = aspect.replace('aspek_', 'sentimen_')
        counts = df[df[sentiment_col] != 'None'][sentiment_col].value_counts()
        print(f"\nDistribution - Aspek {aspect.replace('aspek_', '').upper()}:")
        print(counts)
        
    out_dir = os.path.join(base_dir, "..", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "reviews_with_aspect_sentiment.csv")
    df.to_csv(out_path, index=False)
    print(f"Saved ABSA results to: {out_path}")

if __name__ == "__main__":
    run_absa()
