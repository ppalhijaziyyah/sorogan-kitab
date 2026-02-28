import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 md:py-12">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Tentang Kami
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          Mengenal lebih dekat visi dan misi di balik pengembangan aplikasi Sorogan.
        </p>
      </header>

      <div className="space-y-10">
        <section className="prose prose-teal dark:prose-invert max-w-none">
          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              <strong className="text-teal-600 dark:text-teal-400">Sorogan App</strong> adalah platform modern yang dirancang khusus untuk memfasilitasi pembelajaran membaca teks Arab klasik atau yang akrab dikenal sebagai <span className="italic">kitab kuning</span> secara interaktif.
            </p>

            <p>
              Aplikasi ini lahir dari kebutuhan untuk menjembatani metode pembelajaran tradisional dengan teknologi digital masa kini. Kami ingin membantu para santri, mahasiswa, dan peminat ilmu keislaman di seluruh dunia agar dapat belajar dengan lebih mudah, efisien, serta dapat diakses di mana saja dan kapan saja.
            </p>

            <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-2xl border border-teal-100 dark:border-teal-800/30 my-8">
              <p className="m-0 italic">
                "Proyek ini adalah eksperimen open-source yang dikembangkan dengan visi melestarikan dan menyebarkan ilmu pengetahuan tradisional melalui kekuatan teknologi kecerdasan buatan dan platform digital."
              </p>
            </div>

            <p>
              Kami percaya bahwa akses terhadap pendidikan berkualitas haruslah terbuka untuk siapa saja. Oleh karena itu, Sorogan akan terus dikembangkan sebagai proyek sumber terbuka yang transparan dan kolaboratif.
            </p>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        <div className="flex justify-center md:justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold hover:scale-105 transition-transform"
          >
            <span>&larr; Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
