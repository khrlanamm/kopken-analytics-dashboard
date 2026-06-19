# Laporan EDA Awal: Ulasan Play Store Kopi Kenangan

Dokumen ini berisi hasil Explorasi Data Analisis (EDA) awal pada dataset mentah ulasan Kopi Kenangan yang diperoleh dari Google Play Store pada tanggal **19 Juni 2026**.

---

## 📊 Ringkasan Dataset

- **Nama File:** `3-appstore-kopken-modeling/scraping/raw_app_reviews.csv`
- **Jumlah Baris (Ulasan):** 5.000
- **Jumlah Kolom:** 8
- **Rentang Waktu:** 24 Agustus 2025 s.d. 18 Juni 2026 (~10 bulan)

---

## 📈 Analisis Distribusi Rating

| Rating | Frekuensi | Persentase |
| :--- | :--- | :--- |
| ⭐ 1 | 162 | 3.24% |
| ⭐ 2 | 18 | 0.36% |
| ⭐ 3 | 22 | 0.44% |
| ⭐ 4 | 112 | 2.24% |
| ⭐ 5 | 4.686 | 93.72% |
| **Total** | **5.000** | **100.00%** |

> **Temuan Utama:** Dataset ulasan sangat didominasi oleh ulasan bintang 5 (93.72%). Hal ini menunjukkan mayoritas pengguna memberikan penilaian positif pada aplikasi/kopi secara keseluruhan, namun kita perlu memperhatikan ulasan bintang 1 (3.24%) untuk mendeteksi keluhan teknis (bug, login, crash).

---

## 🏷️ Analisis Versi Aplikasi (Top 10)

| Versi Aplikasi | Jumlah Ulasan | Keterangan |
| :--- | :--- | :--- |
| `NaN` (Tidak Terdeteksi) | 728 | Pengguna tidak memperbarui versi app atau data tidak terekam |
| `126.04.23` | 447 | Rilis Terbaru |
| `126.03.26` | 350 | - |
| `125.11.27` | 318 | - |
| `125.10.24` | 288 | - |
| `126.01.30` | 277 | - |
| `126.02.26` | 267 | - |
| `125.09.18` | 248 | - |
| `126.01.08` | 239 | - |
| `125.12.22` | 225 | - |

---

## 🔍 Analisis Kata Kunci (Top 20 Teratas)

Berikut adalah kata-kata yang paling sering muncul sebelum dilakukan pembersihan slang/stopword:

1. `kopi` (886)
2. `dan` (762)
3. `nya` (635)
4. `mantap` (574)
5. `enak` (573)
6. `di` (452)
7. `kenangan` (374)
8. `kopinya` (355)
9. `sangat` (324)
10. `banyak` (321)
11. `bagus` (281)
12. `pelayanan` (278)
13. `promo` (265)
14. `aplikasi` (255)
15. `good` (251)
16. `yg` (227)
17. `rasa` (214)
18. `banget` (205)
19. `juga` (193)
20. `buat` (185)

> **Kategori Aspek yang Terdeteksi dari Kata Kunci:**
> - **Rasa/Produk:** `kopi`, `kopinya`, `enak`, `rasa`
> - **Pelayanan:** `pelayanan`
> - **Harga/Promo:** `promo`
> - **Sistem Aplikasi:** `aplikasi`, `good` (ulasan aplikasi umum)
> - **Slang/Kata Tidak Baku:** `nya`, `yg`, `banget` (butuh preprocessing normalisasi)

---

## 📝 Kesimpulan EDA & Langkah Berikutnya

1. **Preprocessing Penting:** Karena banyak kata singkatan (`yg`, `nya`) dan kata hubung (`dan`, `di`), normalisasi teks dengan kamus slang dan penghapusan stopword sangat penting untuk dilakukan sebelum pemodelan aspek.
2. **Keseimbangan Kelas:** Distribusi rating menunjukkan data ulasan positif (bintang 5) jauh lebih banyak dibanding negatif (bintang 1-3). Pemodelan klasifikasi aspek harus mampu menangani ketidakseimbangan kelas ini atau fokus pada pelabelan aspek multi-label yang akurat tanpa memandang bias rating.
3. **Penyaringan Kategori Teknis:** Banyaknya kata `aplikasi` mengonfirmasi perlunya penambahan aspek khusus `aspek_aplikasi` pada taksonomi.
