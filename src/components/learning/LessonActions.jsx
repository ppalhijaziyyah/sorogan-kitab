import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const LessonActions = ({ lessonData, lessonId, setSliderState, setQuizMode }) => {
  const { completedLessons, toggleLessonComplete } = useContext(AppContext);
  const isCompleted = completedLessons.includes(lessonId);

  return (
    <div className="text-center mt-8 pt-6 border-t border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4">
      {lessonData.quizData && lessonData.quizData.length > 0 && <button onClick={() => setQuizMode(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">Mulai Kuis</button>}
      <button onClick={() => toggleLessonComplete(lessonId)} className={`font-semibold py-2 px-5 rounded-lg shadow-md transition-all ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}`}>{isCompleted ? '✓ Selesai Dipelajari' : 'Tandai sebagai Selesai'}</button>
    </div>
  );
};

export default LessonActions;