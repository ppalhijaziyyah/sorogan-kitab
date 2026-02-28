import React, { useState, useEffect, useContext } from 'react';
import Word from './Word';
import { AppContext } from '../../contexts/AppContext';

const LessonContent = ({ lessonData, setSliderState }) => {
  const { settings, lastReset } = useContext(AppContext);
  const { isNgaLogatMode, showAllNgaLogat } = settings; // Destructure new settings

  const [harakatStates, setHarakatStates] = useState({});
  const [translationStates, setTranslationStates] = useState({});
  const [ngaLogatStates, setNgaLogatStates] = useState({}); // New state
  const [currentFocusParagraph, setCurrentFocusParagraph] = useState(0);

  // Reset states when lessonData changes or when settings are reset (lastReset change)
  useEffect(() => {
    setHarakatStates({});
    setTranslationStates({});
    setNgaLogatStates({}); // Add this
    setCurrentFocusParagraph(0);
  }, [lessonData, lastReset]);

  // Reset individual states when their corresponding mode is toggled.
  useEffect(() => {
    setHarakatStates({});
  }, [settings.isHarakatMode]);

  useEffect(() => {
    setTranslationStates({});
  }, [settings.isTranslationMode]);

  useEffect(() => {
    setNgaLogatStates({}); // New useEffect
  }, [isNgaLogatMode]);

  const handleWordClick = (pIndex, wIndex) => {
    const wordId = `${pIndex}-${wIndex}`;
    setCurrentFocusParagraph(pIndex);

    if (settings.isHarakatMode) {
      setHarakatStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
    if (settings.isTranslationMode) {
      setTranslationStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
    if (isNgaLogatMode) { // Conditionally toggle nga-logat visibility
      setNgaLogatStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
  };

  const handleWordDoubleClick = (wordData) => {
    if (wordData.irab) {
      setSliderState({ isOpen: true, title: wordData.berharakat, content: <p className="text-right" dir="rtl">{wordData.irab}</p>, type: 'irab', link: wordData.link });
    }
  };

  return (
    <div id="text-container" className="text-right leading-loose font-arabic select-none" dir="rtl" style={{ fontSize: 'var(--arabic-font-size)', lineHeight: 'var(--arabic-line-height)' }}>
      {lessonData.textData.map((paragraph, pIndex) => (
        <div key={pIndex} className={`mb-6 transition-opacity duration-300 ${settings.isFocusMode && pIndex !== currentFocusParagraph ? 'paragraph-unfocused' : ''}`}>
          {paragraph.map((wordData, wIndex) => {
            const wordId = `${pIndex}-${wIndex}`;

            const isHarakatVisible = settings.showAllHarakat || (settings.isHarakatMode && harakatStates[wordId]);
            const isTranslationVisible = settings.showAllTranslations || (settings.isTranslationMode && translationStates[wordId]);
            const isNgaLogatVisible = showAllNgaLogat || (isNgaLogatMode && ngaLogatStates[wordId]); // New calculation

            return (
              <Word
                key={wIndex}
                wordData={wordData}
                isHarakatVisible={isHarakatVisible}
                isTranslationVisible={isTranslationVisible}
                isNgaLogatVisible={isNgaLogatVisible} // New prop
                onClick={() => handleWordClick(pIndex, wIndex)}
                onDoubleClick={() => handleWordDoubleClick(wordData)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default LessonContent;