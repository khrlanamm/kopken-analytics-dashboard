# App Store & Play Store Kopi Kenangan ABSA Modeling

Proyek ini bertujuan untuk membangun pipeline **Aspect-Based Sentiment Analysis (ABSA)** pada ulasan pelanggan Kopi Kenangan yang diambil dari **Google Play Store** dan **Apple App Store**. 

Pipeline ini dirancang untuk berjalan sejalan dengan pipeline Google Maps yang sudah ada (`2-gmaps-kopken-modeling`), namun disesuaikan untuk kebutuhan ulasan aplikasi mobile (seperti performa aplikasi, bug, fitur order, pengiriman, dll).

---

## Struktur Direktori

```text
.
├── scraping/                  # Script scraping untuk mengambil ulasan mentah
│   ├── scrape_playstore.py    # Scraping Play Store reviews
│   └── raw_app_reviews.csv    # Dataset ulasan mentah hasil scraping
├── preprocessing/             # Pembersihan data dan pra-pemrosesan ulasan
│   ├── preprocessing_app.ipynb # Notebook pembersihan data
│   ├── slang_tambahan_app.txt # Kamus slang tambahan khusus teknis app
│   └── cleaned_app_reviews.csv # Dataset ulasan bersih siap olah
├── modeling/                  # Pipeline pemodelan dan analisis sentimen
│   ├── aspect_taxonomy_app.md # Taksonomi aspek khusus ulasan aplikasi
│   ├── topik_modelling/       # Pemodelan topik (LDA/BERTopic)
│   ├── aspect_labeling/       # Pelabelan semi-otomatis berbasis aturan/kata kunci
│   ├── aspek_modelling/       # Pemodelan klasifikasi aspek (baseline SVM)
│   ├── finetunning_modelling/ # Fine-tuning model aspek (IndoBERT/Transformer)
│   ├── absa_sentiment/        # Pelabelan sentimen berbasis leksikon per aspek
│   ├── aggregasi_insight/     # Agregasi data per versi aplikasi/OS untuk dashboard
│   └── export_dashboard_data_app.py # Script inferensi & ekspor data akhir dashboard
└── reports/                   # Laporan analisis, EDA, dan performa model
```

---

## Cara Penggunaan

### 1. Scraping Ulasan
Jalankan script scraping untuk memperbarui ulasan dari Google Play Store:
```bash
python scraping/scrape_playstore.py
```
Data mentah akan disimpan di `scraping/raw_app_reviews.csv`.

### 2. Preprocessing Data
Buka dan jalankan notebook `preprocessing/preprocessing_app.ipynb` untuk membersihkan teks, melakukan stemming, normalisasi slang, dan membuang stopword.
Output bersih disimpan sebagai `preprocessing/cleaned_app_reviews.csv`.

### 3. Pipeline Pemodelan
Jalankan notebook di folder `modeling/` secara berurutan:
- **`topik_modelling_app.ipynb`**: Untuk memvalidasi topik/aspek yang dibahas pengguna.
- **`aspect_labeling_app.ipynb`**: Untuk melabeli data bersih secara semi-otomatis.
- **`aspek_modelling_app.ipynb`** & **`finetunning_app.ipynb`**: Melatih model pengklasifikasi aspek.
- **`absa_sentiment_app.ipynb`**: Menilai sentimen aspek menggunakan leksikon.
- **`aggregasi_insight_app.ipynb`**: Mengagregasikan insight per versi aplikasi dan rating.

### 4. Ekspor Data ke Dashboard
Untuk memproses data baru secara otomatis dan mengekspornya ke format dashboard:
```bash
python modeling/export_dashboard_data_app.py
```
