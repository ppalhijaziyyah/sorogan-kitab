import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full my-4">
      <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
        <span>Progres Kuis</span>
        <span>{current} / {total} Selesai</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-teal-400 to-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
