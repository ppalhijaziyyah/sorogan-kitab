# Cara Deploy Ulang Aplikasi

Berikut adalah langkah-langkah untuk melakukan update pada aplikasi yang sudah di-hosting di GitHub Pages.

## Prasyarat

Pastikan semua perubahan kode sudah Anda `commit` dan `push` ke branch utama Anda (misalnya `main` atau `master`).

```bash
# 1. Tambahkan semua perubahan
git add .

# 2. Buat commit dengan pesan yang jelas
git commit -m "feat: menambahkan fitur baru" 

# 3. Push ke repository Anda
git push origin main
```

## Langkah-langkah Deployment

Setelah semua perubahan ada di GitHub, cukup jalankan satu perintah berikut di terminal Anda:

```bash
npm run deploy
```

**Apa yang terjadi saat Anda menjalankan perintah ini?**

1.  **`npm run build`**: Script ini akan dijalankan terlebih dahulu untuk membuat versi produksi terbaru dari aplikasi Anda di dalam folder `dist`.
2.  **`gh-pages -d dist`**: Konten baru dari folder `dist` akan di-push secara otomatis ke branch `gh-pages` di repositori GitHub Anda.

GitHub Pages akan mendeteksi perubahan pada branch `gh-pages` dan secara otomatis memperbarui situs live Anda. Biasanya hanya butuh satu atau dua menit hingga perubahan tersebut dapat terlihat di URL publik Anda.
