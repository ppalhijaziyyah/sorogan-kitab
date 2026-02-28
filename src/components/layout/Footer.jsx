import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import ConfirmationModal from '../ui/ConfirmationModal';





const Footer = ({ setSliderState }) => {
  const { resetProgress } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmReset = () => {
    resetProgress();
    setIsModalOpen(false);
  };


  return (
    <>
      <footer className="bg-white/50 dark:bg-gray-900/50 mt-12 shadow-inner backdrop-blur-sm">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <h3 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 font-bold">Sorogan</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">Platform interaktif untuk belajar membaca dan memahami teks Arab gundul.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                <Link to="/tentang-kami" className="hover:text-teal-500 dark:hover:text-teal-400">Tentang Kami</Link>
                <Link to="/dukung-kami" className="hover:text-teal-500 dark:hover:text-teal-400">Dukung Kami</Link>
                <button onClick={handleResetClick} className="hover:text-red-500 dark:hover:text-red-400">Reset Progres</button>
              </div>

            </div>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; 2025 Sorogan App. Dibuat dengan Gemini.
            <p className="mt-2">Seluruh konten materi pelajaran di aplikasi ini dilindungi hak cipta. Dilarang menyalin atau menyebarkan ulang tanpa izin dari pengembang.</p>
          </div>
        </div>
      </footer>
      <ConfirmationModal
        isOpen={isModalOpen}
        message="Apakah Anda yakin ingin mereset semua progres belajar Anda? Aksi ini tidak dapat dibatalkan dan akan memuat ulang aplikasi."
        onConfirm={handleConfirmReset}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Footer;
