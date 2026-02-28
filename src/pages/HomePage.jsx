import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 relative">
        {/* Ornamen Buku */}
        <div className="absolute top-0 left-0 w-8 h-full bg-teal-800/10 dark:bg-teal-300/10 border-r border-teal-800/20 dark:border-teal-300/20"></div>
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-l from-black/5 to-transparent"></div>

        <div className="p-10 pl-14 flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 mb-6 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-teal-600 dark:text-teal-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-teal-600 to-teal-800 dark:from-teal-300 dark:to-teal-500 mb-2 font-arabic leading-tight">
            الكتاب التفاعلي
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
            Sorogan Web Book
          </h2>

          <div className="w-16 h-1 bg-teal-500 rounded-full mb-6"></div>

          <p className="text-gray-600 dark:text-gray-400 mb-10 text-sm leading-relaxed">
            Belajar membaca dan memahami teks Arab gundul dengan antarmuka buku nirkertas interaktif.
          </p>

          <button
            onClick={() => navigate('/book')}
            className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Buka Kitab</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link to="/tentang-kami" className="hover:text-teal-600 dark:hover:text-teal-400 underline decoration-dotted underline-offset-4 mr-4">Tentang Proyek</Link>
        <Link to="/dukung-kami" className="hover:text-teal-600 dark:hover:text-teal-400 underline decoration-dotted underline-offset-4">Dukung Kami</Link>
      </div>
    </div>
  );
};

export default HomePage;
