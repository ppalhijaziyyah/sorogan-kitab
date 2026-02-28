import React, { useRef, useContext, useState, useLayoutEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';

const getNgaLogatPositionStyle = (position) => {
  const baseOffset = '1.3em'; // Base offset from the word
  const transformX = 'translateX(-50%)'; // For centering horizontally

  switch (position) {
    case 'top': return { top: `-${baseOffset}`, left: '50%', transform: transformX };
    case 'bottom': return { bottom: `-${baseOffset}`, left: '50%', transform: transformX };
    case 'top-left': return { top: `-${baseOffset}`, left: '0' };
    case 'top-right': return { top: `-${baseOffset}`, right: '0' };
    case 'bottom-left': return { bottom: `-${baseOffset}`, left: '0' };
    case 'bottom-right': return { bottom: `-${baseOffset}`, right: '0' };
    default: return {};
  }
};

const Word = ({ wordData, isHarakatVisible, isTranslationVisible, isNgaLogatVisible, onClick, onDoubleClick }) => {
  const { settings, ngalogatSymbolColors } = useContext(AppContext);
  const { useNgaLogatColorCoding } = settings; // No showNgaLogat here anymore
  const isPunctuation = /[.،؟:!()"«»]/.test(wordData.gundul) && wordData.gundul.length < 3;
  const displayText = isHarakatVisible ? wordData.berharakat : wordData.gundul;

  const wordRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState({});

  useLayoutEffect(() => {
    // Calculate style only when the tooltip is meant to be visible
    if (isTranslationVisible && wordData.terjemahan && wordRef.current) {
      const wordSpan = wordRef.current;
      const arabicTextWidth = wordSpan.offsetWidth;

      // Use a temporary element to measure the longest word in the translation
      const tempMeasurer = document.createElement('div');
      tempMeasurer.className = 'translation-tooltip'; // Use same class for accurate font styling
      tempMeasurer.style.position = 'absolute';
      tempMeasurer.style.visibility = 'hidden';
      tempMeasurer.style.whiteSpace = 'nowrap';
      document.body.appendChild(tempMeasurer);

      let longestWordWidth = 0;
      wordData.terjemahan.split(' ').forEach(word => {
        tempMeasurer.textContent = word;
        if (tempMeasurer.offsetWidth > longestWordWidth) {
          longestWordWidth = tempMeasurer.offsetWidth;
        }
      });
      document.body.removeChild(tempMeasurer);

      const width = Math.max(arabicTextWidth, longestWordWidth) + 16; // Add some padding

      setTooltipStyle({ width: `${width}px` });
    }
  }, [isTranslationVisible, wordData.terjemahan]);

  const defaultNgaLogatColor = 'var(--text-color-ngalogat-default)';

  return (
    <span
      onClick={() => !isPunctuation && onClick()}
      onDoubleClick={() => !isPunctuation && onDoubleClick()}
      className={`relative inline-flex flex-col justify-start items-center transition-[min-width] duration-300 ease-in-out px-1 group ${isPunctuation ? '' : 'cursor-pointer rounded'}`}
      style={{
        marginLeft: 'var(--word-spacing)',
        verticalAlign: 'top',
        minWidth: isTranslationVisible && tooltipStyle.width ? tooltipStyle.width : '0px',
        lineHeight: '1'
      }}
    >
      {/* Custom hover background */}
      {!isPunctuation && (
        <span className="absolute left-0 right-0 top-0 bottom-0 bg-teal-500/10 dark:bg-teal-400/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0" />
      )}
      <span ref={wordRef} className="relative z-10">{displayText}</span>
      {isNgaLogatVisible && wordData.nga_logat && wordData.nga_logat.map((logat, index) => {
        const symbolColor = useNgaLogatColorCoding
          ? (ngalogatSymbolColors[logat.symbol] || defaultNgaLogatColor)
          : defaultNgaLogatColor;
        return (
          <span
            key={index}
            className={`absolute whitespace-nowrap leading-none z-10`}
            style={{
              fontSize: `var(--ngalogat-font-size)`, // Use ngalogat font size
              color: symbolColor, // Apply conditional color
              ...getNgaLogatPositionStyle(logat.position), // Function to calculate position
            }}
          >
            {logat.symbol}
          </span>
        );
      })}

      {/* Animated Translation Box in Document Flow */}
      {wordData.terjemahan && (
        <div
          className={`grid transition-all duration-300 ease-in-out w-full pointer-events-none`}
          style={{
            gridTemplateRows: isTranslationVisible ? '1fr' : '0fr',
            opacity: isTranslationVisible ? 1 : 0,
            marginBottom: isTranslationVisible ? 'var(--toast-margin-bottom)' : '0px',
            maxWidth: isTranslationVisible ? '224px' : '0px'
          }}
        >
          <div
            className="overflow-hidden flex justify-center min-h-0 w-full"
            style={{ paddingTop: 'var(--toast-padding-top)' }}
          >
            <div
              className="translation-tooltip"
              dir="ltr"
              style={{
                fontSize: 'var(--tooltip-font-size)',
                position: 'relative',  // use relative so ::before triangle anchors here
                top: '0',              // override top: 100% from CSS
                left: '0',             // override left: 50% from CSS
                transform: 'none',     // override transform from CSS
                margin: '0 auto',      // override top margin from CSS
                width: tooltipStyle.width ? tooltipStyle.width : 'max-content'   // ensure wrapping happens properly relative to max-width
              }}
            >
              {wordData.terjemahan}
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default Word;