# 🏷️ Aspect Taxonomy Definition (Kopi Kenangan App Reviews ABSA)

Dokumen ini mendefinisikan taksonomi aspek yang digunakan untuk melakukan klasifikasi aspek berbasis ulasan pelanggan pada Google Play Store dan App Store untuk aplikasi Kopi Kenangan.

Taksonomi ini dirancang berdasarkan kategori utama operasional aplikasi mobile, transaksi F&B online, dan pengiriman (delivery), serta disesuaikan dengan pola ulasan/masalah yang sering muncul pada data ulasan toko aplikasi.

---

## 📌 Daftar Aspek & Kata Kunci (Keywords)

| ID Aspek | Nama Aspek | Penjelasan Kategori | Kata Kunci Terkait (Stemmed & Root) |
| :--- | :--- | :--- | :--- |
| **`aspek_rasa`** | Rasa & Kualitas Minuman | Rasa, suhu, konsistensi racikan produk kopi, non-kopi, dan makanan/roti yang dibeli via aplikasi. | `kopi`, `minuman`, `rasa`, `enak`, `pahit`, `manis`, `es`, `susu`, `roti`, `menu`, `cup`, `kualitas`, `asin`, `gurih`, `cokelat`, `latte`, `matcha`, `boba`, `tawar`, `encer`, `pekat`, `panas`, `dingin` |
| **`aspek_harga`** | Harga & Promo | Kesesuaian harga produk, adanya promo, diskon, cashback, paket bundling, poin loyalitas, dan penukaran voucher. | `harga`, `mahal`, `murah`, `promo`, `diskon`, `cashback`, `ovo`, `gopay`, `shopeepay`, `worth`, `hemat`, `paket`, `voucher`, `poin`, `reward`, `points`, `point`, `vocher`, `vocr`, `dana`, `qris`, `linkaja` |
| **`aspek_aplikasi`** | Performa & Fitur Aplikasi | Masalah teknis aplikasi (bug, crash, lag, error), kendala login/logout, kegagalan request OTP, tampilan/UI, serta performa aplikasi secara keseluruhan. | `app`, `aplikasi`, `order`, `pesan`, `sistem`, `down`, `error`, `apk`, `bug`, `crash`, `lag`, `login`, `logout`, `update`, `notif`, `ui`, `tampilan`, `lemot`, `macet`, `otp`, `sms`, `keluar`, `masuk`, `loading`, `pemuatan`, `uninstall`, `uninstal`, `copot` |
| **`aspek_pelayanan`** | Pelayanan CS/Support | Responsivitas dan keramahan Customer Service (CS), keluhan yang ditangani admin, serta pelayanan dari staf store jika melakukan pick-up. | `cs`, `customer`, `service`, `komplain`, `respon`, `balas`, `admin`, `pelayanan`, `staff`, `karyawan`, `ramah`, `sopan`, `jutek`, `barista`, `kasir` |
| **`aspek_kecepatan`** | Kecepatan & Waktu Tunggu | Durasi waktu tunggu pembuatan pesanan (pick-up) dan kecepatan pengantaran pesanan. | `lama`, `cepat`, `antri`, `nunggu`, `lambat`, `tunggu`, `antrean`, `gercep`, `lelet`, `durasi`, `menit`, `jam`, `telat`, `keterlambatan` |
| **`aspek_stok`** | Ketersediaan Stok/Menu | Kelengkapan menu di aplikasi, kehabisan bahan baku (boba, cup, roti), atau menu di gerai terdekat yang kosong/tidak sedia di aplikasi. | `habis`, `stok`, `menu`, `sedia`, `kosong`, `varian`, `kehabisan`, `ready`, `sold`, `out` |
| **`aspek_pengiriman`** | Layanan Pengiriman | Kinerja driver/kurir, kualitas kemasan (packaging) saat dikirim, tumpah, dan keamanan paket sampai tujuan. | `kurir`, `driver`, `gojek`, `grab`, `lalamove` `kirim`, `tumpah`, `packaging`, `kemasan`, `bocor`, `solasi`, `segel` |
| **`aspek_pesanan`** | Akurasi & Sistem Pesanan | Kesesuaian barang yang diterima (salah menu/ukuran), pesanan yang kurang, pembatalan sepihak (cancel), dan proses pengembalian dana (refund). | `salah`, `kurang`, `tidak sesuai`, `beda`, `cancel`, `refund`, `batal`, `kembali uang`, `salah pesanan` |

---

## 🛠️ Aturan Pelabelan (Labeling Rules)

1. **Multi-Label Classification:** Satu ulasan dapat memiliki nilai `1` pada lebih dari satu kolom aspek.
   - *Contoh:* *"Aplikasi sering crash pas mau bayar, padahal mau pakai voucher promo"* → `aspek_aplikasi` = 1, `aspek_harga` = 1.
2. **Review Umum/Tanpa Kategori:** Jika ulasan tidak menyebutkan aspek apa pun yang spesifik, maka seluruh kolom bernilai `0` (atau ditandai sebagai ulasan `umum`).
   - *Contoh:* *"Sangat bagus"* atau *"Suka sekali"* → Semua aspek = 0.
3. **Keyword Matching vs. Context:** Keyword matching digunakan sebagai inisialisasi label. Namun, jika ada kata kunci yang maknanya berubah karena konteks (negasi/perbandingan), koreksi manual atau fine-tuning model ML (Stage 5) akan bertugas memperbaikinya.
