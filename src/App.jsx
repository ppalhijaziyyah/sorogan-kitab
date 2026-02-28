import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage'; // Import BookPage
import AboutUsPage from './pages/AboutUsPage';
import SupportUsPage from './pages/SupportUsPage';
import HowToUsePage from './pages/HowToUsePage';
import BottomSlider from './components/ui/BottomSlider';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import ScrollToTop from './components/common/ScrollToTop';

const StudioPage = React.lazy(() => import('./pages/studio/StudioPage'));

function App() {
  const [sliderState, setSliderState] = React.useState({ isOpen: false });

  const location = useLocation();
  const isBookPage = location.pathname === '/book';

  return (
    <div className={`font-sans`}>
      <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark text-light-text dark:text-dark-text transition-colors duration-500">
        <Header />
        <main className="px-4 py-8">
          <Suspense fallback={<div className="text-center">Memuat...</div>}>
            <ScrollToTop>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/book" element={<BookPage setSliderState={setSliderState} />} />
                <Route path="/panduan-penggunaan" element={<HowToUsePage />} />
                <Route path="/tentang-kami" element={<AboutUsPage />} />
                <Route path="/dukung-kami" element={<SupportUsPage />} />
              </Routes>
            </ScrollToTop>
          </Suspense>
        </main>
        <Footer setSliderState={setSliderState} />
        <BottomSlider
          sliderState={sliderState}
          onClose={() => {
            if (sliderState.onClose) {
              sliderState.onClose();
            }
            setSliderState({ isOpen: false });
          }}
        />
        <ScrollToTopButton />
      </div>
    </div>
  );
}

export default App;
