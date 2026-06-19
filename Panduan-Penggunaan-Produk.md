# Panduan Penggunaan Produk (Kopken ABSA Dashboard & Analytics Web)

**Proyek:** Analisis Sentimen Aplikasi dan Gerai Kopi Kenangan (PJK-RM114)  
**Tema:** AI for Business Intelligence and Market Insights  

Dokumen ini berisi panduan operasional langkah demi langkah bagi pengguna (Manajemen, Business Analyst, dan Staf Operasional) untuk mengoperasikan dan memahami fitur-fitur analisis sentimen berbasis aspek (ABSA) pada platform **KopKen Sentiment Analytics**.

Sistem ini terbagi menjadi dua bagian utama:
1. **Interactive Demo Apps (Streamlit):** Aplikasi pengujian real-time untuk menganalisis sentimen satu per satu ulasan baru.
2. **Analytics Web Dashboard (Next.js):** Platform visualisasi data skala besar untuk menganalisis tren performa bisnis secara agregat dari ulasan historis Google Maps dan Google Play Store.

---

## Tautan Akses Web Dashboard
Web Analytics Dashboard dapat diakses secara instan secara online melalui peramban (browser) di:
* **Tautan Utama:** [https://kopken-insights.web.app/](https://kopken-insights.web.app/)
* **Tautan Cadangan:** [https://kopken-insights.firebaseapp.com/](https://kopken-insights.firebaseapp.com/)

---

## Persyaratan Pengoperasian (System Requirements)

* **Untuk Akses Online (Rekomendasi):** Hanya memerlukan koneksi internet dan browser modern (Google Chrome, Safari, Mozilla Firefox, atau Edge) di PC/Laptop maupun Smartphone.
* **Untuk Menjalankan Secara Lokal (Local Development):**
  * **Streamlit:** Python 3.10+ (Jalankan perintah `streamlit run app.py` di direktori `streamlit_app_gmaps_model` atau `streamlit_app_playstore_model`).
  * **Web Dashboard:** Node.js 18+ (Jalankan `npm run dev` di direktori `kopken-project` untuk membuka dashboard di `http://localhost:3000`).

---

## Panduan Penggunaan Aplikasi Demo Interaktif (Streamlit)

Aplikasi Streamlit dirancang untuk pengujian langsung (*ad-hoc testing*) model klasifikasi aspek (SVM) dan leksikon sentimen (InSet).

### Langkah Penggunaan:
1. **Pilih Platform:** Jalankan aplikasi Streamlit gerai fisik (Maps) di port `8501` atau aplikasi digital (Play Store) di port `8502`.
2. **Masukkan Ulasan:** Ketik ulasan pelanggan pada kotak teks utama (contoh: *"Kopi kenangan mantan manisnya pas dan creamy, tapi layanannya lelet banget bikin emosi"*).
3. **Analisis:** Klik tombol **"Analisis Sentimen Aspek"**.
4. **Interpretasi Hasil:**
   * **Preprocessing:** Sistem menampilkan teks bersih hasil pembersihan slang/singkatan (misalnya *"yg"* menjadi *"yang"*, *"lelet"* tetap dipertahankan).
   * **Visualisasi Aspek:** Menampilkan kartu aspek yang terdeteksi dengan warna border dinamis:
     * **Hijau (Positive):** Pujian pada aspek tersebut (misal: Rasa).
     * **Merah (Negative):** Keluhan pada aspek tersebut (misal: Kecepatan Layanan).
     * **Abu-abu (Tidak Terdeteksi):** Aspek tidak dibahas dalam ulasan.
   * **Analisis Klausa:** Menampilkan potongan kalimat spesifik beserta skor angka polaritas sentimennya.

---

## Panduan Fitur & Analisis Web Dashboard (Next.js)

Web Dashboard dirancang bagi pengambil keputusan untuk memantau reputasi brand Kopi Kenangan secara makro. Berikut penjelasan detail mengenai setiap halaman dan cara membacanya:

### 1. Halaman Ringkasan (Overview Page)

Halaman ini mengintegrasikan seluruh umpan balik dari platform online (Aplikasi) dan offline (Gerai Fisik) ke dalam satu dashboard ringkasan eksekutif.

* **Kartu Indikator Utama (KPI Cards):**
  * **Total Reviews:** Menampilkan jumlah total ulasan terakumulasi yang telah dianalisis oleh AI. Berguna untuk memantau volume umpan balik.
  * **App Rating:** Rata-rata penilaian bintang (1-5) dari Google Play Store. Representasi kepuasan pengguna produk digital.
  * **Maps Rating:** Rata-rata penilaian bintang (1-5) dari Google Maps. Representasi kepuasan pelanggan saat berkunjung langsung ke gerai.
  * **Positive Sentiment:** Rasio ulasan bernada positif dari keseluruhan data. Merupakan indikator kesehatan reputasi brand secara umum.
* **Grafik Tren Sentimen (Sentiment Trend Chart):**
  * **Deskripsi:** Grafik area interaktif yang membandingkan performa sentimen positif (%) bulanan antara Aplikasi (warna merah tua) vs Gerai Fisik (warna kuning tembaga).
  * **Cara Membaca:** 
    * Gerakkan kursor di atas grafik untuk melihat persentase sentimen positif pada bulan tertentu.
    * Jika garis merah turun tajam pada bulan tertentu, tandanya terjadi masalah teknis pasca-update aplikasi (misalnya kegagalan pembayaran).
    * Jika garis kuning turun, tandanya ada masalah operasional gerai secara serentak (misalnya masalah rantai pasok bahan baku).
* **Grafik Distribusi Sentimen (Sentiment Distribution):**
  * **Deskripsi:** Grafik lingkaran (Pie Chart) yang membagi proporsi ulasan ke dalam tiga kategori: *Positive* (Hijau), *Neutral* (Abu-abu), dan *Negative* (Merah).
  * **Cara Membaca:** Arahkan kursor pada potongan lingkaran untuk melihat jumlah absolut ulasan di setiap kategori sentimen.
* **Daftar Ulasan Terbaru (Recent Reviews):**
  * **Deskripsi:** Menampilkan 10 ulasan terbaru dari kedua sumber beserta badge sentimen hasil klasifikasi model. Memudahkan pemantauan keluhan/pujian yang baru saja masuk.

---

### 2. Analisis Aplikasi Digital (Digital App Analytics)

Halaman ini berfokus khusus pada data Google Play Store untuk membantu tim IT dan produk menganalisis kualitas aplikasi mobile Kopi Kenangan.

* **Grafik Sentimen Aspek Teknis (Stacked Bar Chart):**
  * **Deskripsi:** Grafik batang bertumpuk yang memetakan sentimen positif, netral, dan negatif di 7 aspek utama: *UI/UX & Performance*, *Price & Promos*, *Staff Service*, *Service Speed*, *Menu Availability*, *Ordering Process*, dan *Delivery App*.
  * **Cara Membaca & Tindakan Bisnis:**
    * Setiap batang mewakili 100% ulasan di aspek tersebut, terbagi menjadi **Hijau (Positif)**, **Abu-abu (Netral)**, dan **Merah (Negatif)**.
    * **Identifikasi Pain Point:** Cari aspek yang memiliki warna merah (negatif) paling dominan. Misalnya, jika *Ordering Process* memiliki bar merah yang tinggi, berarti ada bug pada alur pemesanan aplikasi yang menghambat transaksi.
* **Tabel Ulasan Play Store (Play Store Reviews List):**
  * **Deskripsi:** Daftar ulasan pelanggan mentah dari Google Play Store.
  * **Cara Penggunaan:** Gunakan tabel ini untuk membaca langsung keluhan spesifik (misalnya detail tipe HP yang mengalami force-close) untuk membantu tim developer melakukan debugging.

---

### 3. Analisis Gerai Fisik (Physical Store Analytics)

Halaman ini berfokus pada data ulasan Google Maps di wilayah Jabodetabek untuk membantu tim operasional dan wilayah memantau kualitas pelayanan di lapangan.

* **Grafik Jaring Aspek Fisik (Radar Chart):**
  * **Deskripsi:** Grafik jaring laba-laba yang memetakan persentase sentimen positif (%) untuk aspek gerai: *Taste / Quality* (Rasa), *Price & Promos* (Harga), *Staff Service* (Pelayanan), *Service Speed* (Kecepatan), *Cleanliness* (Kebersihan), dan *Menu Availability* (Stok).
  * **Cara Membaca & Tindakan Bisnis:**
    * Jaring yang semakin melebar ke arah luar (mendekati 100%) menunjukkan aspek yang berjalan sangat baik (misalnya kualitas rasa produk yang konsisten).
    * Titik jaring yang menciut ke arah dalam (nilai rendah) menunjukkan kelemahan operasional di gerai. Jika aspek *Cleanliness* berada di bawah 50%, tim manajemen perlu mengeluarkan kebijakan standar operasional kebersihan baru.
* **Peringkat Performa Gerai (Store Performance Ranking):**
  * **Deskripsi:** Grafik horizontal bar yang menampilkan **Top 5 Best Outlets** (gerai berkinerja terbaik dengan bar hijau) dan **Bottom 5 Worst Outlets** (gerai berkinerja terburuk dengan bar merah).
  * **Cara Membaca & Tindakan Bisnis:**
    * **Top 5:** Mengidentifikasi cabang-cabang teladan (misalnya: *Ruko Ir H Juanda 3 Jakarta*). Manajemen dapat mempelajari taktik operasional di cabang ini untuk diterapkan di tempat lain.
    * **Bottom 5:** Mengidentifikasi cabang-cabang kritis yang memerlukan tindakan cepat (misalnya: *Ruko Greenville*). Tim audit area harus segera dikirimkan ke lokasi tersebut untuk melakukan inspeksi kualitas pelayanan, ketersediaan bahan baku, atau keramahan staf.
* **Tabel Ulasan Google Maps (Google Maps Reviews List):**
  * **Deskripsi:** Menampilkan nama gerai spesifik, rating bintang, teks ulasan, dan sentimen ABSA-nya. Memudahkan penelusuran balik keluhan pada gerai tertentu.

---

## Pemecahan Masalah Operasional (Troubleshooting)

* **Mengapa data grafik tidak muncul dan hanya menampilkan loading / error?**
  * *Penyebab:* Koneksi internet terputus saat mengakses web, atau database JSON di lokal belum ter-render.
  * *Solusi:* Pastikan perangkat terhubung ke internet. Jika menjalankan secara lokal, pastikan Anda telah menjalankan perintah `npm run prebuild` terlebih dahulu untuk menghasilkan file JSON data.
* **Mengapa ulasan di tabel Google Maps tidak mencantumkan tanggal yang bervariasi?**
  * *Penyebab:* Proses scraping Google Maps tidak merekam metadata timestamp secara default demi kecepatan scraping.
  * *Solusi:* Seluruh ulasan Google Maps menggunakan tanggal default scraping terakhir. Fokus analisis pada halaman ini adalah performa spasial (per gerai) dan aspek, bukan runtun waktu (timeline).
* **Aspek pada grafik Stacked Bar atau Radar menampilkan persentase yang tidak biasa, apakah datanya akurat?**
  * *Penyebab:* Model machine learning (SVM) mendeteksi aspek berdasarkan kata kunci kontekstual. Beberapa ulasan pendek mungkin tidak diklasifikasikan ke aspek manapun dan masuk ke aspek umum.
  * *Solusi:* Persentase dihitung secara proporsional hanya dari ulasan yang terdeteksi membahas aspek tersebut untuk menjaga validitas data visual.