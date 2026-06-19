import os
import pandas as pd
import numpy as np

def run_labeling():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "..", "..", "preprocessing", "cleaned_app_reviews.csv")
    
    print(f"Loading cleaned data from {dataset_path}...")
    df = pd.read_csv(dataset_path).dropna(subset=['text_clean'])
    print(f"Loaded {len(df)} rows.")
    
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
    
    def label_review_aspects(text, keywords):
        if not isinstance(text, str):
            return pd.Series([0] * len(keywords))
        
        text_lower = text.lower()
        labels = {}
        for aspect, kws in keywords.items():
            labels[aspect] = 1 if any(kw in text_lower for kw in kws) else 0
        return pd.Series(labels)

    print("Running aspect labeling...")
    label_cols = df['text_clean'].apply(lambda x: label_review_aspects(x, aspect_keywords))
    df_labeled = pd.concat([df, label_cols], axis=1)
    
    # Identify generic reviews (don't fit into any defined aspects)
    aspect_list = list(aspect_keywords.keys())
    df_labeled['aspek_umum'] = (df_labeled[aspect_list].sum(axis=1) == 0).astype(int)
    print("Labeling complete!")
    
    print("\n=== Aspect Label Counts ===")
    for col in aspect_list + ['aspek_umum']:
        count = df_labeled[col].sum()
        percentage = (count / len(df_labeled)) * 100
        print(f"{col}: {count} reviews ({percentage:.2f}%)")
        
    out_dir = os.path.join(base_dir, "..", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "cleaned_app_reviews_with_aspect_labels.csv")
    df_labeled.to_csv(out_path, index=False)
    print(f"Saved labeled reviews to: {out_path}")

if __name__ == "__main__":
    run_labeling()
