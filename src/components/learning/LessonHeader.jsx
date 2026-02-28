import React from 'react';

const LessonHeader = ({ titleArabic, title }) => {
  return (
    <header className="flex justify-center items-center mb-8">
      <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 font-arabic text-center truncate">
        {titleArabic || title}
      </h1>
    </header>
  );
};

export default LessonHeader;