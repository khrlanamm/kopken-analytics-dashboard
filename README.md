# KopKen Analytics Dashboard

Dashboard template untuk "Analisis Sentimen Aplikasi dan Gerai Kopi Kenangan" (Team ID: PJK-RM114).

Dibangun menggunakan:
- [Next.js 14 (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Fitur Utama

- **Overview Page:** Ringkasan KPI performa aplikasi dan gerai Kopi Kenangan, trend sentimen 3 tahun terakhir (2023-2025), dan distribusi sentimen keseluruhan.
- **Digital App Analytics:** Analisis spesifik sentimen aplikasi Kopi Kenangan di Google Play Store (UI/UX, Performa, dll).
- **Physical Store Analytics:** Analisis sentimen gerai fisik Kopi Kenangan di area Jabodetabek melalui ulasan Google Maps, mencakup kecepatan pelayanan, kebersihan, hingga komparasi performa gerai.
- **Dark/Light Mode:** Terintegrasi penuh dengan `next-themes`.

## Cara Menjalankan (Local Development)

Pastikan kamu sudah menginstal Node.js di sistem.

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## Struktur Direktori

- `src/app`: Berisi halaman utama dashboard (`/`, `/digital`, `/physical`) dan global styles.
- `src/components`: Komponen layout (`Header`, `Sidebar`, `ThemeToggle`) dan komponen dasar dari Shadcn UI (`ui/*`).
- `src/lib/mockData.ts`: Menyimpan data statis/mock data yang di-render di dalam visualisasi chart.

---
*Developed by PJK-RM114 Team*
