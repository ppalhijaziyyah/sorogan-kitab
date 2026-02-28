import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import ConfirmationModal from '../ui/ConfirmationModal'; // Import modal
import useSoundEffect from '../../hooks/useSoundEffect';

// Helper function to shuffle an array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const Quiz = ({ lessonData, onFinishQuiz, lessonId }) => {
  const { toggleLessonComplete } = useContext(AppContext);
  const { playCorrect, playWrong } = useSoundEffect();

  // --- State Management ---
  const [mode, setMode] = useState('in_progress'); // in_progress, finished, review
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // The option string the user selected
  const [score, setScore] = useState(0);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false); // State for exit confirmation

  // ... (rest of the component logic remains the same)

  // --- Initialization ---
  useEffect(() => {
    if (lessonData.quizData) {
      setShuffledQuestions(shuffleArray(lessonData.quizData));
    }
  }, [lessonData]);

  const currentQuestion = useMemo(() => {
    if (!shuffledQuestions || shuffledQuestions.length === 0) return null;
    const question = shuffledQuestions[currentIndex];
    return {
      ...question,
      shuffledOptions: shuffleArray(question.options)
    };
  }, [currentIndex, shuffledQuestions]);

  // --- Event Handlers ---
  const handleAnswer = (option) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);
    const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
    const isCorrect = option === correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      playCorrect();
    } else {
      playWrong();
    }

    setUserAnswers(prev => [...prev, { ...currentQuestion, selectedAnswer: option, correctAnswer, isCorrect }]);

    setTimeout(() => {
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setMode('finished');
        toggleLessonComplete(lessonId);
      }
    }, 2000);
  };

  const handleRestart = () => {
    setShuffledQuestions(shuffleArray(lessonData.quizData));
    setUserAnswers([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setMode('in_progress');
  };

  if (mode === 'review') {
    const reviewItem = userAnswers[currentIndex];

    return (
      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl mx-auto">
        <p className="text-center font-semibold mb-4 text-lg">Meninjau Pertanyaan {currentIndex + 1}</p>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center min-h-[6rem] flex items-center justify-center">{reviewItem.question}</h2>
        {reviewItem.context && <p className="font-arabic text-3xl text-center mb-6" dir="rtl">{reviewItem.context}</p>}
        <div className="flex flex-col gap-3 md:gap-4">
          {reviewItem.options.map((option, index) => {
            let buttonClass = 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 opacity-60 grayscale'; // Default inactive state
            let icon = '';

            if (option === reviewItem.correctAnswer) {
              buttonClass = 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700 dark:text-green-400 font-bold';
              icon = '✓';
            } else if (option === reviewItem.selectedAnswer && !reviewItem.isCorrect) {
              buttonClass = 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 font-bold opacity-80';
              icon = '✗';
            }

            return (
              <button key={index} disabled className={`w-full p-4 rounded-xl flex items-center justify-between text-left min-h-[4rem] transition-all ${buttonClass}`}>
                <span className="flex-grow text-base md:text-lg">{option}</span>
                <span className="text-2xl font-bold">{icon}</span>
              </button>
            );
          })}
        </div>
        {reviewItem.explanation && (
          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-800/30 border-l-4 border-yellow-500 rounded-r-lg">
            <h4 className="font-bold text-lg mb-2 text-yellow-800 dark:text-yellow-300">Penjelasan</h4>
            <p className="text-yellow-900 dark:text-yellow-200">{reviewItem.explanation}</p>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0} className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg disabled:opacity-50">Sebelumnya</button>
          <button onClick={() => setMode('finished')} className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg">Kembali ke Skor</button>
          <button onClick={() => setCurrentIndex(i => i + 1)} disabled={currentIndex === userAnswers.length - 1} className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg disabled:opacity-50">Berikutnya</button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="text-center">Memuat kuis...</div>;

  const correctAnswerText = currentQuestion.options[currentQuestion.correctAnswer];

  // Calculate stats for finished dialog
  const totalQuestions = shuffledQuestions.length;
  const wrongCount = totalQuestions - score;
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <>
      <ConfirmationModal
        isOpen={isExitModalOpen}
        message="Apakah Anda yakin ingin keluar dari kuis? Progres akan hilang."
        onConfirm={onFinishQuiz} // Go back to lesson page
        onCancel={() => setIsExitModalOpen(false)}
      />

      {/* Finished Dialog Overlay */}
      {mode === 'finished' && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Kuis Selesai!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Berikut adalah hasil kuis Anda:</p>

            <div className="flex justify-around items-center mb-8 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
              <div>
                <div className="text-4xl font-black text-green-500">{score}</div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mt-1">Benar</div>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-slate-600"></div>
              <div>
                <div className="text-4xl font-black text-red-500">{wrongCount}</div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mt-1">Salah</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-6xl font-black text-teal-500 drop-shadow-sm">{accuracy}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Akurasi Keseluruhan</div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => { setMode('review'); setCurrentIndex(0); }} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                Tinjau Kuis
              </button>
              <button onClick={handleRestart} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                Ulangi Kuis
              </button>
              <button onClick={onFinishQuiz} className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all active:scale-95">
                Kembali ke Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">Pertanyaan {currentIndex + 1} dari {shuffledQuestions.length}</p>
          <button onClick={() => setIsExitModalOpen(true)} className="w-8 h-8 flex items-center justify-center text-3xl pb-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors">&times;</button>
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center min-h-[6rem] flex items-center justify-center text-gray-800 dark:text-gray-100">{currentQuestion.question}</h2>
        {currentQuestion.context && <p className="font-arabic text-3xl text-center mb-8 text-teal-800 dark:text-teal-300" dir="rtl">{currentQuestion.context}</p>}
        <div className="flex flex-col gap-3 md:gap-4">
          {currentQuestion.shuffledOptions.map((option, index) => {
            let buttonClass = 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700 dark:hover:border-teal-500 cursor-pointer active:scale-[0.98]';

            if (selectedAnswer) {
              buttonClass = 'bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500 opacity-60 grayscale cursor-default';

              if (option === correctAnswerText) {
                buttonClass = 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700 dark:text-green-400 font-bold scale-[1.02] shadow-md z-10 cursor-default';
              } else if (option === selectedAnswer) {
                buttonClass = 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 font-bold opacity-80 cursor-default';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
                className={`w-full p-4 rounded-xl flex items-center justify-between text-left min-h-[4rem] transition-all duration-300 ${buttonClass}`}
              >
                <span className="flex-grow text-base md:text-lg">{option}</span>
                {selectedAnswer && option === correctAnswerText && <span className="text-2xl font-bold text-green-600 dark:text-green-400">✓</span>}
                {selectedAnswer && option === selectedAnswer && option !== correctAnswerText && <span className="text-2xl font-bold text-red-600 dark:text-red-400">✗</span>}
              </button>
            );
          })}
        </div>
        <div className="mt-6 text-center font-bold h-8 text-2xl transition-all duration-300">
          {selectedAnswer && (
            <span className={selectedAnswer === correctAnswerText ? 'text-green-500' : 'text-red-500'}>
              {selectedAnswer === correctAnswerText ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Quiz;
