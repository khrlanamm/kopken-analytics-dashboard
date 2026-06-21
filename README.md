# KopKen Analytics Dashboard

### ☕ Analisis Sentimen Aplikasi dan Gerai Kopi Kenangan (Team ID: PJK-RM114)
**Tema Proyek:** AI for Business Intelligence and Market Insights  

KopKen Analytics Dashboard adalah platform visualisasi data interaktif berskala besar yang dirancang untuk memetakan reputasi brand Kopi Kenangan secara hibrida. Platform ini mengintegrasikan output pemodelan **Aspect-Based Sentiment Analysis (ABSA)** berbasis Machine Learning dari ulasan digital (Google Play Store) dan operasional lapangan (Google Maps Jabodetabek).

---

## 🔗 Tautan Akses Live Production
Aplikasi web ini telah dideploy dan dapat diakses secara publik melalui:
* **Tautan Utama:** [https://kopken-insights.web.app/](https://kopken-insights.web.app/)
* **Tautan Cadangan:** [https://kopken-insights.firebaseapp.com/](https://kopken-insights.firebaseapp.com/)

---

## 🚀 Alur Kerja Sistem & Teknologi

Dashboard ini mengonsumsi data asli hasil pemrosesan pipeline machine learning backend:
1. **Pengumpulan Data (Scraping):** Crawling ulasan Google Maps Jabodetabek menggunakan Selenium dan Play Store Reviews menggunakan Scraper API.
2. **Pra-pemrosesan (Preprocessing):** Pembersihan teks, konversi bahasa slang/singkatan Indonesia ke bentuk baku, stemming morfologi bahasa Indonesia (Sastrawi), dan pemotongan klausa berbasis konjungsi (NLTK).
3. **Pemodelan ABSA (Modelling):**
   * **Klasifikasi Aspek:** Menggunakan algoritma **Support Vector Machine (SVM)** dengan pembobotan TF-IDF untuk mendeteksi kategori aspek yang dibahas.
   * **Klasifikasi Sentimen:** Menggunakan **InSet Lexicon** (Indonesian Sentiment Lexicon) untuk menentukan polaritas sentimen ulasan (Positif, Netral, Negatif) pada tingkat aspek/klausa.

### Tech Stack Utama Dashboard:
* **Framework Web:** Next.js 14 (App Router, Static Output Export)
* **Styling & UI:** Tailwind CSS, Shadcn UI, Lucide Icons
* **Visualisasi Data:** Recharts (Area, Stacked Bar, Radar, Pie Charts)
* **Bahasa Pemrograman:** TypeScript & Node.js
* **Hosting Platform:** Firebase Hosting (Spark Tier CDN)

---

## 📊 Fitur Dashboard & Analisis

### 1. Halaman Ringkasan (Overview Page)
* **Metrik KPI Utama:** Total akumulasi ulasan (~7,800+ ulasan), rating bintang rata-rata untuk aplikasi (Google Play Store), rating rata-rata gerai fisik (Google Maps), dan rasio sentimen positif keseluruhan.
* **Sentiment Trend Chart:** Grafik area bulanan (kronologis dari Agustus 2025 - Juni 2026) untuk membandingkan fluktuasi sentimen positif aplikasi vs gerai.
* **Pie Chart Distribusi:** Proporsi ulasan positif, netral, dan negatif secara makro.
* **Ulasan Terbaru:** Feed 10 ulasan terbaru terintegrasi dari kedua platform.

### 2. Analisis Aplikasi Digital (Digital App Analytics)
* **Stacked Bar Chart Aspek Teknis:** Visualisasi persentase sentimen pada 7 aspek aplikasi (*UI/UX & Performance*, *Price & Promos*, *Staff Service*, *Service Speed*, *Menu Availability*, *Ordering Process*, dan *Delivery App*). Memudahkan tim developer mendeteksi bug/crash.
* **Play Store Reviews Table:** Tabel ulasan real lengkap dengan bintang rating dan klasifikasi sentimen AI.

### 3. Analisis Gerai Fisik (Physical Store Analytics)
* **Radar Chart Aspek Fisik:** Diagram jaring pelacakan kepuasan pelanggan pada aspek fisik gerai (*Taste*, *Price*, *Service*, *Speed*, *Cleanliness*, *Stock*, dll.).
* **Store Performance Ranking:** Horizontal Bar Chart mendeteksi **Top 5 Best Outlets** (bar hijau) dan **Bottom 5 Worst Outlets** (bar merah) berdasarkan ulasan Google Maps.
* **Google Maps Reviews Table:** Tabel ulasan spasial terperinci per-outlet.

---

## 💻 Cara Menjalankan Secara Lokal (Local Development)

### 1. Kloning Repositori & Instalasi
Pastikan Anda telah menginstal **Node.js 18+** pada sistem Anda.
```bash
# Kloning proyek
git clone https://github.com/khrlanamm/kopken-analytics-dashboard.git
cd kopken-analytics-dashboard

# Instal dependensi
npm install
```

### 2. Kompilasi Data
Jalankan script untuk mengompilasi data ulasan CSV dari pipeline machine learning backend menjadi file JSON static di dalam folder public:
```bash
npm run prebuild
```

### 3. Jalankan Server Lokal
Jalankan server pengembangan lokal:
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000) untuk melihat dashboard.

---

## 📂 Struktur Direktori Proyek

* `data_pipelines/` - Berisi repositori hasil scraping dan pemodelan ML (Play Store & Google Maps).
* `scripts/build-data.js` - Script build-time compiler untuk mengekstrak data CSV menjadi model JSON.
* `public/api/dashboard/` - Folder penyimpanan data static JSON hasil prebuild (`overview.json`, `digital.json`, `physical.json`).
* `src/app/` - Direktori halaman Next.js App Router (Overview `/`, Digital `/digital`, Physical `/physical`).
* `src/components/` - Komponen visual (Sidebar, Header, ThemeProvider) dan library dasar UI Shadcn.
* `src/lib/dataFetcher.ts` - Helper parser CSV dan aggregator metrics internal.
* `firebase.json` & `.firebaserc` - File konfigurasi deployment Firebase Hosting.

---

## 🛠️ Cara Deploy ke Firebase Hosting

Dashboard dikonfigurasi menggunakan Next.js Static Export untuk kecepatan respons dan efisiensi resource.

```bash
# 1. Jalankan build Next.js (menghasilkan folder build static 'out/')
npm run build

# 2. Deploy folder 'out/' ke CDN Firebase Hosting
npx -y firebase-tools@latest deploy --only hosting
```

---
*Developed by PJK-RM114 Team - Capstone Project*
