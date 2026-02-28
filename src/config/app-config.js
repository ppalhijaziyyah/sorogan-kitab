// Konfigurasi Utama Aplikasi Sorogan
// Berkas ini menyimpan setelan bawaan (default) dasar yang mengatur bagaimana
// muka dan prilaku aplikasi Sorogan Anda sejak kali pertama dibuka.
// 
// Ubahlah nilai-nilai di bawah ini sesuai selera Anda.
// *Catatan: Beberapa perubahan mungkin memerlukan Anda untuk menekan tombol
// "Reset ke Default" di Pengaturan Lanjutan aplikasi agar efeknya menimpa
// setelan lama yang sudah terlanjur tersimpan di komputer/peramban pengguna.

export const appConfig = {
    // ---------------------------------------------------------
    // 1. IDENTITAS APLIKASI
    // ---------------------------------------------------------

    // Nama aplikasi ini akan tampil di bagian atas halaman dan di penjepit peramban (tab title).
    appName: "Safinatun Najah",


    // ---------------------------------------------------------
    // 2. TIPOGRAFI & UKURAN TEKS STANDAR (dalam REM)
    //    (1 rem biasanya sama dengan 16px)
    // ---------------------------------------------------------

    defaultTextSettings: {
        arabicSize: 1.875,       // Ukuran standar huruf Arab teks kitab
        lineHeight: 2.5,         // Jarak kerenggangan antar-baris teks Arab
        wordSpacing: 0.25,       // Jarak kerenggangan antar-kata Arab
        tooltipSize: 0.8,      // Ukuran font untuk kotak Terjemahan kata (Tooltip/Toast)
        irabSize: 1.5,           // Ukuran teks pop-up layar penuh (I'rab/Tarkib)

        // Jenis huruf bawaan Arab (Gaya Penulisan). 
        // Daftar pilihan populer:
        // '"Noto Naskh Arabic", serif'   -> Standar, bersih dan proporsional.
        // '"Amiri", serif'               -> Klasik, elegan, ala cetakan Mesir.
        // '"Lateef", serif'              -> Lugas, sederhana dan bulat.
        // '"Scheherazade New", serif'    -> Sangat tebal, cocok untuk layar sempit.
        arabicFontFamily: '"Noto Naskh Arabic", serif'
    },


    // ---------------------------------------------------------
    // 3. SPASI & TATA LETAK KHUSUS
    // ---------------------------------------------------------

    layout: {
        // Jarak antara teks terjemahan (toast) ke elemen di atas dan bawahnya.
        // Ditulis dalam ukuran CSS baku (seperti "1.25rem", "20px", dll).
        //
        // pt_toast: "padding-top" untuk kotak toast (semakin besar angkanya,
        //           semakin jauh kotak toast dari kata Arab di atasnya).
        // mb_toast: "margin-bottom" untuk kotak toast (semakin besar angkanya,
        //           semakin merenggang baris arab yang ada tepat di bawahnya).
        pt_toast: "1.25rem",  // Setara kelas Tailwind 'pt-5'
        mb_toast: "1.5rem"    // Setara kelas Tailwind 'mb-6'
    },


    // ---------------------------------------------------------
    // 4. SETELAN FITUR AWAL (AKTIF / NON-AKTIF)
    //    (Gunakan boolean: true atau false)
    // ---------------------------------------------------------

    defaultFeatures: {
        isHarakatMode: true,           // Harakat standar menyala atau mati
        isTranslationMode: false,      // Mode terjemah-per-kata otomatis mati awalnya
        showAllTranslations: false,    // Apakah semua terjemah per-kata terbuka sekaligus
        showAllHarakat: false,         // Apakah semua harakat Tasykil terbuka sekaligus
        isFocusMode: false,            // Mode Fokus layar penuh (tanpa bilah menu)
        isNgaLogatMode: false,         // Fitur Nga-Logat kitab sunda (Pégon)
        showAllNgaLogat: false,        // Buka semua mode Nga-Logat sekaligus
        useNgaLogatColorCoding: false, // Gunakan panduan warna-warni pada Nga-Logat
        isTasykilMode: false,          // Mode Tasykil layar penuh interaktif
        isSoundEnabled: true           // Umpan balik suara interaksi (efek klik)
    }
};
