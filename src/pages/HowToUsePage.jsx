import React from 'react';

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500 mb-4 mt-8 first:mt-0">
    {children}
  </h2>
);

const FeatureItem = ({ icon, title, children }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-baseline gap-3">
      <span className="text-teal-500 text-lg translate-y-[2px]">{icon}</span>
      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
        <div className="text-base text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const HowToUsePage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 md:py-12">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Panduan Penggunaan
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          Pelajari cara memaksimalkan pengalaman belajar membaca kitab kuning dengan fitur-fitur interaktif Sorogan.
        </p>
      </header>

      <div className="space-y-10">
        {/* Bagian 1: Dasar */}
        <section>
          <SectionTitle>Dasar Interaksi</SectionTitle>
          <div className="pl-1">
            <FeatureItem icon="👆" title="Interaksi Teks">
              <p>Setiap kata dalam teks Arab bersifat interaktif:</p>
              <ul className="list-disc list-inside mt-2 ml-1 text-gray-500 dark:text-gray-400">
                <li><strong>Klik Sekali:</strong> Menampilkan harakat atau terjemahan (sesuai mode toolbar).</li>
                <li><strong>Klik Dua Kali:</strong> Menampilkan analisis <em>I'rab</em> (tata bahasa).</li>
              </ul>
            </FeatureItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 2: Toolbar & Tampilan */}
        <section>
          <SectionTitle>Pengaturan Tampilan</SectionTitle>
          <div className="pl-1">
            <FeatureItem icon="👁️" title="Mode Baca">
              <p>Gunakan tombol di toolbar atas untuk bantuan visual:</p>
              <ul className="list-disc list-inside mt-2 ml-1 text-gray-500 dark:text-gray-400">
                <li><strong>Mode Harakat (ح):</strong> Klik kata untuk melihat harakatnya.</li>
                <li><strong>Mode Terjemah (T):</strong> Klik kata untuk melihat artinya.</li>
                <li><strong>Tampilkan Semua:</strong> Membuka semua harakat/terjemah sekaligus.</li>
              </ul>
            </FeatureItem>

            <FeatureItem icon="⚙️" title="Kustomisasi">
              <p>Klik ikon <strong>Gear</strong> di pojok kanan atas untuk:</p>
              <ul className="list-disc list-inside mt-2 ml-1 text-gray-500 dark:text-gray-400">
                <li>Mengubah <strong>Ukuran Font</strong> (Arab & Latin).</li>
                <li>Mengganti <strong>Jenis Font Arab</strong> (LPMQ, Amiri, dll).</li>
                <li>Mengatur <strong>Spasi Antar Kata</strong>.</li>
                <li>Mengaktifkan/menonaktifkan <strong>Transliterasi</strong>.</li>
              </ul>
            </FeatureItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 3: Fitur Audio */}
        <section>
          <SectionTitle>Efek Suara</SectionTitle>
          <div className="pl-1">
            <FeatureItem icon="🔊" title="Umpan Balik Audio">
              <p>
                Aplikasi dilengkapi efek suara halus untuk interaksi (klik, navigasi, sukses kuis).
                Anda dapat mematikan suara ini melalui tombol <strong>Speaker</strong> di menu pengaturan.
              </p>
            </FeatureItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 4: Mode Tasykil */}
        <section>
          <SectionTitle>Mode Tasykil (Latihan)</SectionTitle>
          <div className="pl-1">
            <FeatureItem icon="✍️" title="Uji Kemampuan Harakat">
              <p>
                Aktifkan sakelar <strong>"Mode Tasykil"</strong> di pengaturan.
                Dalam mode ini, teks akan gundul total. Saat Anda mengklik kata, akan muncul
                pilihan harakat. Pilih harakat yang benar untuk menguji penguasaan Nahwu/Shorof Anda.
              </p>
            </FeatureItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 5: Alur Belajar */}
        <section>
          <SectionTitle>Tips Belajar Efektif</SectionTitle>
          <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-2xl border border-teal-100 dark:border-teal-800/30">
            <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
              <li><strong>Baca Gundul:</strong> Coba baca teks tanpa bantuan apapun terlebih dahulu.</li>
              <li><strong>Cek Keraguan:</strong> Gunakan klik pada kata yang Anda ragu bacanya.</li>
              <li><strong>Pahami Makna:</strong> Aktifkan "Terjemahan Lengkap" untuk konteks menyeluruh.</li>
              <li><strong>Analisis:</strong> Klik dua kali kata kunci untuk mendalami I'rab-nya.</li>
              <li><strong>Evaluasi:</strong> Kerjakan Kuis di akhir materi untuk mengukur pemahaman.</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToUsePage;