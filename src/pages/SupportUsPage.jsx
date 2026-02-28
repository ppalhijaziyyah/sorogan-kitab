import React from 'react';
import { Link } from 'react-router-dom';
import UserBadge from '../components/ui/UserBadge';
import data from '../data/sponsors-contributors.json';

const SectionTitle = ({ children, id }) => (
  <h2 id={id} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500 mb-6 mt-12 first:mt-0">
    {children}
  </h2>
);

const SupportUsPage = () => {
  const sponsors = data.filter(user => user.type === 'sponsor').sort((a, b) => b.amount - a.amount);
  const contributors = data.filter(user => user.type === 'contributor').sort((a, b) => b.contributionCount - a.contributionCount);

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 md:py-12">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Dukung Kami
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          Kontribusi Anda membantu kami menjaga aplikasi ini tetap gratis dan terus berkembang untuk semua orang.
        </p>
      </header>

      <div className="space-y-12">
        {/* Bagian Ajakan */}
        <section>
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-8 rounded-3xl text-white shadow-xl shadow-teal-500/20">
            <h2 className="text-2xl font-bold mb-4">Misi Kami</h2>
            <p className="text-lg opacity-90 leading-relaxed mb-6">
              Aplikasi ini gratis dan akan selalu gratis. Kami percaya bahwa akses terhadap pendidikan agama dan bahaa Arab harus terbuka luas bagi siapa saja tanpa hambatan biaya.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/ppalhijaziyyah/sorogan-kitab"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-teal-600 font-black px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
              >
                Kontribusi di GitHub
              </a>
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian Sponsor */}
        <section>
          <SectionTitle id="sponsors">Para Sponsor</SectionTitle>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Terima kasih kepada individu dan lembaga yang telah memberikan dukungan finansial untuk operasional dan pengembangan Sorogan.
          </p>

          {sponsors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sponsors.map(user => (
                <UserBadge key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 italic">Belum ada sponsor. Jadilah yang pertama mendukung proyek ini!</p>
            </div>
          )}
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian Kontributor */}
        <section>
          <SectionTitle id="contributors">Para Kontributor</SectionTitle>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Aplikasi ini dibangun dari keringat dan ide-ide cemerlang para pengembang dan penyusun konten.
          </p>

          {contributors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {contributors.map(user => (
                <UserBadge key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 italic">Belum ada kontributor kode.</p>
            </div>
          )}
        </section>

        <div className="flex justify-center md:justify-start pt-8">
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

export default SupportUsPage;