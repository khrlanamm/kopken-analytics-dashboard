import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, f1_score
import joblib

def run_modeling():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "..", "data", "cleaned_app_reviews_with_aspect_labels.csv")
    
    print(f"Loading labeled reviews from {dataset_path}...")
    df = pd.read_csv(dataset_path).dropna(subset=['text_clean'])
    print(f"Loaded {len(df)} rows.")
    
    aspect_cols = ['aspek_rasa', 'aspek_harga', 'aspek_aplikasi', 'aspek_pelayanan', 'aspek_kecepatan', 'aspek_stok', 'aspek_pengiriman', 'aspek_pesanan']
    
    X = df['text_clean']
    y = df[aspect_cols].values
    
    # Split data 80% Train, 20% Test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.2, 
        random_state=42
    )
    print(f"Train size: {len(X_train)}, Test size: {len(X_test)}")
    
    # Vectorize
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    print(f"TF-IDF feature size: {X_train_tfidf.shape[1]}")
    
    # Train Multi-label SVM
    base_svm = SVC(kernel='linear', probability=True, random_state=42)
    multilabel_model = OneVsRestClassifier(base_svm)
    
    print("Training SVM model (this might take a few seconds)...")
    multilabel_model.fit(X_train_tfidf, y_train)
    print("SVM training completed!")
    
    # Evaluate
    y_pred = multilabel_model.predict(X_test_tfidf)
    micro_f1 = f1_score(y_test, y_pred, average='micro')
    macro_f1 = f1_score(y_test, y_pred, average='macro')
    
    print(f"Micro F1-Score: {micro_f1:.4f}")
    print(f"Macro F1-Score: {macro_f1:.4f}\n")
    
    # Save reports
    weights_dir = os.path.join(base_dir, "..", "weights")
    reports_dir = os.path.join(base_dir, "..", "..", "reports")
    os.makedirs(weights_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    
    joblib.dump(multilabel_model, os.path.join(weights_dir, 'aspect_classifier_svm.pkl'))
    joblib.dump(vectorizer, os.path.join(weights_dir, 'tfidf_vectorizer_aspect.pkl'))
    
    eval_dict = {
        "model_type": "TF-IDF + OneVsRest SVM (App Reviews)",
        "overall_micro_f1": float(micro_f1),
        "overall_macro_f1": float(macro_f1),
        "aspects_evaluated": aspect_cols
    }
    
    with open(os.path.join(reports_dir, 'aspect_model_evaluation_app.json'), 'w') as f:
        json.dump(eval_dict, f, indent=4)
        
    print(f"Saved model to modeling/weights and report to reports/aspect_model_evaluation_app.json.")

if __name__ == "__main__":
    run_modeling()
