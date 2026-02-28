import React from 'react';

const FullTranslation = ({ text, isVisible }) => {
  if (!isVisible || !text) {
    return null;
  }

  return (
    <div className="mt-8 animate-fade-in">
      <div className="p-5 bg-gray-50 dark:bg-slate-800/50 border-l-4 border-teal-500 rounded-r-lg">
        <h3 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">Terjemahan Lengkap</h3>
        <p className="text-base leading-relaxed whitespace-pre-line">
          {text}
        </p>
      </div>
    </div>
  );
};

export default FullTranslation;
