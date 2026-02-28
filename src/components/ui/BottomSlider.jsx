import React, { useState, useEffect } from 'react';

const BottomSlider = ({ sliderState, onClose }) => {
  const { isOpen, title, content, type } = sliderState || {};
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // When the slider is told to open, we mount it and then trigger the animation
      const timer = setTimeout(() => setIsShowing(true), 10);
      return () => clearTimeout(timer);
    }
    // No need for an else, closing is handled by handleClose
  }, [isOpen]);

  const handleClose = () => {
    // Trigger the exit animation
    setIsShowing(false);
    // Wait for the animation to finish before calling the parent's onClose
    setTimeout(() => {
      onClose();
    }, 300); // This duration must match the transition duration in the className
  };

  if (!isOpen) {
    return null;
  }

  const direction = type === 'irab' ? 'rtl' : 'ltr';
  const fontClass = type === 'irab' ? 'font-arabic' : 'font-sans';
  const sizeStyle = type === 'irab' ? { fontSize: 'var(--irab-font-size)' } : {};

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-black z-[150] flex justify-center items-end transition-opacity duration-300 ease-in-out ${isShowing ? 'bg-opacity-50' : 'bg-opacity-0'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ease-in-out ${isShowing ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-4">
          {type === 'irab' ? (
            <>
              <button onClick={handleClose} className="text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
              <h2 dir={direction} className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 ${fontClass} ${type === 'irab' ? 'text-right' : ''} flex-grow`} style={type === 'irab' ? { ...sizeStyle, textAlign: 'right' } : {}}>{title}</h2>
            </>
          ) : (
            <>
              <h2 dir={direction} className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 ${fontClass}`}>{title}</h2>
              <button onClick={handleClose} className="text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
            </>
          )}
        </div>
        <div className={`prose dark:prose-invert max-w-none ${fontClass}`} style={sizeStyle}>
          {content}
          {type === 'irab' && sliderState.link && (
            <div className="mt-4 text-center">
              <a
                href={sliderState.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Pelajari Lebih Lanjut
                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomSlider;