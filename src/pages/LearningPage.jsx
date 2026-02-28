import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson';
import { AppContext } from '../contexts/AppContext';
import Quiz from '../components/learning/Quiz';
import LearningToolbar from '../components/learning/LearningToolbar';
import Tutorial from '../components/ui/Tutorial';
import masterIndex from '../data/master-index.json';
import { generateSlug } from '../lib/utils';
import LessonHeader from '../components/learning/LessonHeader';
import LessonContent from '../components/learning/LessonContent';
import LessonActions from '../components/learning/LessonActions';
import LessonSkeleton from '../components/skeletons/LessonSkeleton';
import FullTranslation from '../components/learning/FullTranslation';
import TasykilMode from '../components/learning/TasykilMode';

const LearningPage = ({ setSliderState }) => {
  const { levelId, lessonSlug } = useParams();

  const lessonId = useMemo(() => {
    const levelMap = { '1': 'Ibtida’i', '2': 'Mutawassit', '3': 'Mutaqaddim' };
    const targetLevel = levelMap[levelId] || 'Ibtida’i'; // Fallback if undefined

    const foundLesson = masterIndex.find(lesson =>
      lesson.level === targetLevel && generateSlug(lesson.title) === lessonSlug
    );
    return foundLesson ? foundLesson.id : null;
  }, [levelId, lessonSlug]);

  const { lessonData, loading, error } = useLesson(lessonId);
  const { settings, updateSettings, resetSettings } = useContext(AppContext);

  const [isQuizMode, setQuizMode] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [showFullTranslation, setShowFullTranslation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [levelId, lessonSlug]);

  if (!lessonId) return <div className="text-center p-8 text-red-500">Pelajaran tidak ditemukan.</div>;
  if (loading) return <LessonSkeleton />;
  if (error) return <div className="text-center p-8 text-red-500"><strong>Error:</strong> {error}</div>;
  if (!lessonData) return null;

  if (isQuizMode) {
    return <Quiz lessonData={lessonData} onFinishQuiz={() => setQuizMode(false)} lessonId={lessonId} />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <LessonHeader
        titleArabic={lessonData.titleArabic}
        title={lessonData.title}
      />

      <main>
        <LearningToolbar
          settings={settings}
          updateSettings={updateSettings}
          onReset={resetSettings}
          isSettingsOpen={isSettingsOpen}
          setSettingsOpen={setSettingsOpen}
          lessonData={lessonData}
          showFullTranslation={showFullTranslation}
          setShowFullTranslation={setShowFullTranslation}
        />

        {settings.isTasykilMode ? (
          <TasykilMode lessonData={lessonData} setSliderState={setSliderState} />
        ) : (
          <LessonContent lessonData={lessonData} setSliderState={setSliderState} />
        )}

        <FullTranslation text={lessonData.fullTranslation} isVisible={showFullTranslation} />

        {lessonData.reference && (
          <div className="mt-6"><p className="text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border-l-4 border-teal-500"><strong>Sumber:</strong> {lessonData.reference}</p></div>
        )}

        <LessonActions
          lessonData={lessonData}
          lessonId={lessonId}
          setSliderState={setSliderState}
          setQuizMode={setQuizMode}
        />
      </main>
      <Tutorial setSliderState={setSliderState} />
    </div>
  );
};

export default LearningPage;