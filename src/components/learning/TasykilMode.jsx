import React, { useState, useEffect, useContext, useMemo, useRef, useLayoutEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useSoundEffect from '../../hooks/useSoundEffect';
import ConfirmationModal from '../ui/ConfirmationModal';

const TasykilMode = ({ lessonData, setSliderState }) => {
    const { settings, updateSettings } = useContext(AppContext);
    const { playCorrect, playWrong } = useSoundEffect();
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [results, setResults] = useState({});
    const [showPopover, setShowPopover] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false); // New state for Review Mode

    // Store references to the word spans to calculate popover positions
    const wordRefs = useRef({});
    const [popoverPosition, setPopoverPosition] = useState({});

    // We only need to track the currently active interactive word for the progression
    // Flatten words to find interactive ones
    const interactiveWords = useMemo(() => {
        let words = [];
        lessonData.textData.forEach((paragraph, pIndex) => {
            paragraph.forEach((wordData, wIndex) => {
                if (wordData.tasykil_options && wordData.tasykil_options.length > 0) {
                    words.push({ ...wordData, pIndex, wIndex, id: `${pIndex}-${wIndex}` });
                }
            });
        });
        return words;
    }, [lessonData]);

    const activeWord = interactiveWords[activeIndex];
    const totalInteractive = interactiveWords.length;
    const answeredCount = Object.keys(results).length;

    // Accuracy logic: (Correct Answers / Total Questions) * 100
    const correctCount = Object.values(results).filter(r => r.status === 'correct').length;
    const accuracy = totalInteractive > 0 ? Math.round((correctCount / totalInteractive) * 100) : 0;
    const progress = totalInteractive > 0 ? Math.round((answeredCount / totalInteractive) * 100) : 0;

    // Finished state definition
    const isFinished = totalInteractive > 0 && answeredCount === totalInteractive;

    // This state holds the ID of the word that is currently showing the popover.
    // Usually it's the activeWord.id, but it can be a previously answered word if clicked.
    const [popoverTargetId, setPopoverTargetId] = useState(null);

    // Setup initial popover on mount
    useEffect(() => {
        if (interactiveWords.length > 0 && !popoverTargetId) {
            setPopoverTargetId(interactiveWords[0].id);
            setShowPopover(true);
        }
    }, [interactiveWords]);

    // Update popover options when target changes
    const currentOptions = useMemo(() => {
        if (!popoverTargetId) return [];
        const [pIdx, wIdx] = popoverTargetId.split('-').map(Number);
        const wordData = lessonData.textData[pIdx][wIdx];
        if (!wordData || !wordData.tasykil_options) return [];

        const allOptions = [wordData.berharakat, ...wordData.tasykil_options];
        return allOptions.sort(() => Math.random() - 0.5);
    }, [popoverTargetId, lessonData]);

    // Calculate popover position independently of line-height
    useLayoutEffect(() => {
        if (showPopover && popoverTargetId && wordRefs.current[popoverTargetId]) {
            const wordSpan = wordRefs.current[popoverTargetId];
            const computedStyle = getComputedStyle(wordSpan);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const fontSize = parseFloat(computedStyle.fontSize);

            // Calculate where the text actually ends visually
            const spaceAbove = (lineHeight - fontSize) / 2;
            const textBottomPosition = spaceAbove + fontSize;

            // Set the top position in pixels + a little padding
            const top = textBottomPosition + 8; // 8px buffer

            setPopoverPosition({ top: `${top}px` });
        }
    }, [showPopover, popoverTargetId]);

    // Auto-scroll when popover opens or moves
    useEffect(() => {
        if (showPopover && popoverTargetId) {
            // Give the DOM a tiny bit of time to render the popover before measuring
            setTimeout(() => {
                const popoverEl = document.getElementById(`popover-${popoverTargetId}`);
                const scrollContainer = document.getElementById('tasykil-scroll-container');
                if (popoverEl && scrollContainer) {
                    const rect = popoverEl.getBoundingClientRect();
                    const containerRect = scrollContainer.getBoundingClientRect();

                    // Check if popover bottom is cut off or too close to bottom edge
                    // Accounting for some bottom padding (e.g., 20px)
                    if (rect.bottom > containerRect.bottom - 20) {
                        // We scroll the container so the bottom of the popover is visible
                        const scrollAmount = rect.bottom - containerRect.bottom + 40; // Add 40px buffer
                        scrollContainer.scrollBy({
                            top: scrollAmount,
                            behavior: 'smooth'
                        });
                    }

                    // Also check if cut off at the top (less likely, but possible)
                    if (rect.top < containerRect.top + 80) { // 80px to account for the sticky header
                        const scrollAmount = rect.top - (containerRect.top + 100);
                        scrollContainer.scrollBy({
                            top: scrollAmount,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 50); // Small delay to ensure render
        }
    }, [showPopover, popoverTargetId]);

    const handleWordClick = (pIndex, wIndex, isInteractive, wordResult) => {
        const clickedId = `${pIndex}-${wIndex}`;

        // Only interactive words can show the tasykil popover
        if (!isInteractive) return;

        // If clicking the currently active question or an already answered question
        if ((activeWord && clickedId === activeWord.id) || wordResult) {
            if (showPopover && popoverTargetId === clickedId) {
                // Toggle off if clicking the same open popover
                setShowPopover(false);
                setPopoverTargetId(null);
            } else {
                // Open popover for this specific word
                setPopoverTargetId(clickedId);
                setShowPopover(true);
            }
        }
    };

    const handleWordDoubleClick = (wordData, isInteractive, wordResult) => {
        // Double click shows I'rab for ALL words.
        // But for interactive words, it only shows if the word has been answered.
        if (isInteractive && !wordResult) {
            return; // Word is part of quiz but hasn't been answered yet
        }

        if (wordData.irab) {
            setSliderState({
                isOpen: true,
                title: wordData.berharakat,
                content: <p className="text-right leading-loose font-arabic" dir="rtl">{wordData.irab}</p>,
                type: 'irab',
                link: wordData.link
            });
        }
    };

    const handleOptionSelect = (option, e) => {
        e.stopPropagation(); // Prevent bubbling to word click
        if (!popoverTargetId) return;

        const [pIdx, wIdx] = popoverTargetId.split('-').map(Number);
        const wordData = lessonData.textData[pIdx][wIdx];

        const isCorrect = option === wordData.berharakat;
        const newResults = {
            ...results,
            [popoverTargetId]: {
                status: isCorrect ? 'correct' : 'wrong',
                selectedOption: option
            }
        };
        setResults(newResults);

        if (isCorrect) {
            playCorrect();
        } else {
            playWrong();
        }

        // Auto advance logic for BOTH correct and wrong
        if (activeWord && popoverTargetId === activeWord.id) {
            if (activeIndex < interactiveWords.length - 1) {
                const nextActiveWord = interactiveWords[activeIndex + 1];
                setActiveIndex(activeIndex + 1);
                setPopoverTargetId(nextActiveWord.id); // Move popover to next
            } else {
                // Quiz finished
                setShowPopover(false);
                setPopoverTargetId(null);
            }
        } else {
            // We were reviewing a past answer, just close it
            setShowPopover(false);
            setPopoverTargetId(null);
        }
    };

    // Close popover when clicking outside (on the background container)
    const handleContainerClick = (e) => {
        // If clicking directly on the container (not its children), close popover
        if (e.target.id === 'text-container') {
            setShowPopover(false);
        }
    };

    const handleRestart = () => {
        setResults({});
        setActiveIndex(0);
        setIsReviewing(false);
        if (interactiveWords.length > 0) {
            setPopoverTargetId(interactiveWords[0].id);
            setShowPopover(true);
        }
    };

    const handleReview = () => {
        setIsReviewing(true);
        setShowPopover(false);
        setPopoverTargetId(null);
    };

    return (
        <div id="tasykil-scroll-container" className="fixed inset-0 z-[100] bg-[#f8fafc] dark:bg-slate-900 overflow-y-auto w-full h-full" onClick={handleContainerClick}>
            <ConfirmationModal
                isOpen={isExitModalOpen}
                message="Apakah Anda yakin ingin keluar dari Mode Tasykil? Progres latihan akan hilang."
                onConfirm={() => {
                    setIsExitModalOpen(false);
                    updateSettings({ isTasykilMode: false });
                }}
                onCancel={() => setIsExitModalOpen(false)}
            />

            {/* Finished Dialog */}
            {isFinished && !isReviewing && (
                <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
                        <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Kuis Selesai!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Berikut adalah hasil latihan Anda:</p>

                        <div className="flex justify-around items-center mb-8 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl">
                            <div>
                                <div className="text-4xl font-black text-green-500">{Object.values(results).filter(r => r.status === 'correct').length}</div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mt-1">Benar</div>
                            </div>
                            <div className="w-px h-12 bg-gray-200 dark:bg-slate-600"></div>
                            <div>
                                <div className="text-4xl font-black text-red-500">{Object.values(results).filter(r => r.status === 'wrong').length}</div>
                                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mt-1">Salah</div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="text-6xl font-black text-teal-500 drop-shadow-sm">{accuracy}%</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Akurasi Keseluruhan</div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={handleReview} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                                Tinjau Jawaban
                            </button>
                            <button onClick={handleRestart} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
                                Ulangi Latihan
                            </button>
                            <button onClick={() => updateSettings({ isTasykilMode: false })} className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all active:scale-95">
                                Kembali ke Pelajaran
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col min-h-screen">
                {/* Sticky Header and Progress Bar */}
                <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={() => setIsExitModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center text-3xl pb-1 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-full transition-colors"
                            title="Keluar Mode Tasykil"
                        >
                            &times;
                        </button>
                        <div className="text-center flex-1">
                            <h2 className="text-xl font-bold font-arabic text-teal-700 dark:text-teal-400" dir="rtl">{lessonData.titleArabic}</h2>
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{lessonData.title}</h3>
                        </div>
                        <div className="w-10 flex items-center justify-center">
                            {isReviewing && (
                                <button
                                    onClick={() => setIsReviewing(false)}
                                    className="px-3 py-1.5 bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 rounded-lg text-sm font-bold shadow-sm"
                                >
                                    Skor
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar inside sticky header */}
                    <div className="px-4 pb-4">
                        <div className="w-full max-w-5xl mx-auto flex items-center gap-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
                                <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap min-w-[60px] text-right">
                                {answeredCount} / {totalInteractive}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-5xl p-4 md:p-8 flex-1 flex flex-col gap-6" id="text-container">
                    {/* Main Text Container */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-100 dark:border-slate-700 p-6 md:p-10 lg:p-12 rounded-2xl shadow-xl text-right leading-loose font-arabic select-none transition-colors mt-2" dir="rtl" style={{ fontSize: 'var(--arabic-font-size)', lineHeight: 'var(--arabic-line-height)' }}>
                        {lessonData.textData.map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-8">
                                {paragraph.map((wordData, wIndex) => {
                                    const wordId = `${pIndex}-${wIndex}`;
                                    const isInteractive = wordData.tasykil_options && wordData.tasykil_options.length > 0;
                                    const wordResult = results[wordId];
                                    const isActiveTarget = activeWord && activeWord.id === wordId;
                                    const isPopoverTarget = showPopover && popoverTargetId === wordId;

                                    let displayText = wordData.berharakat; // Default for non-interactive

                                    if (isInteractive) {
                                        if (!wordResult) {
                                            displayText = wordData.gundul;
                                        } else if (wordResult.status === 'wrong') {
                                            displayText = wordResult.selectedOption;
                                        }
                                    }

                                    // Styling Logic
                                    let boxClass = "inline-flex justify-center px-1 rounded transition-all duration-300 relative border-2 ";
                                    let style = { marginLeft: 'var(--word-spacing)' };

                                    if (isInteractive) {
                                        boxClass += "cursor-pointer ";
                                        if (!wordResult) {
                                            // Unanswered state - dashed border
                                            boxClass += "border-dashed ";
                                            if (isActiveTarget) {
                                                boxClass += "border-teal-500 bg-teal-50 dark:bg-teal-900/40 animate-calm-breathe text-teal-900 dark:text-teal-100 font-bold ";
                                            } else {
                                                boxClass += "border-gray-300 text-gray-400 dark:text-gray-500 border-opacity-50 dark:border-opacity-30 ";
                                            }
                                        } else if (wordResult.status === 'correct') {
                                            // Correct answered state - solid border
                                            boxClass += "border-solid text-green-600 dark:text-green-400 font-bold border-green-200 dark:border-green-900/40 bg-green-50/50 dark:bg-green-900/20 ";
                                        } else if (wordResult.status === 'wrong') {
                                            // Wrong answered state - solid border
                                            boxClass += "border-solid text-red-500 dark:text-red-400 decoration-wavy decoration-red-500 border-red-200 dark:border-red-900/40 ";
                                            if (isPopoverTarget) {
                                                boxClass += "bg-red-50 dark:bg-red-900/30 ";
                                            }
                                        }
                                    } else {
                                        // Keep non-interactive words in their normal styling
                                        boxClass += "border-transparent text-gray-800 dark:text-gray-200 cursor-default ";
                                    }

                                    return (
                                        <span
                                            key={wIndex}
                                            className="relative inline-block" // Wrapper for positioning popover
                                            style={style}
                                        >
                                            <span
                                                ref={(el) => (wordRefs.current[wordId] = el)}
                                                className={boxClass}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWordClick(pIndex, wIndex, isInteractive, wordResult);
                                                }}
                                                onDoubleClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWordDoubleClick(wordData, isInteractive, wordResult);
                                                }}
                                            >
                                                {displayText}
                                            </span>

                                            {/* Dynamic Popover */}
                                            {isPopoverTarget && (
                                                <div
                                                    id={`popover-${wordId}`}
                                                    // Remove mt-[0.2em] and use the calculated top pixel position
                                                    className="absolute z-50 bg-slate-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl shadow-2xl p-[0.3em] w-max min-w-[3em] right-1/2 translate-x-1/2 transform transition-all text-center"
                                                    style={popoverPosition}
                                                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popover
                                                >
                                                    {/* Pointer Triangle */}
                                                    <div className="absolute -top-[0.2em] right-1/2 translate-x-1/2 w-[0.4em] h-[0.4em] bg-slate-50 dark:bg-slate-900 border-t border-l border-gray-300 dark:border-slate-600 transform rotate-45"></div>

                                                    <div className="relative z-10">
                                                        <div className="flex flex-col gap-[0.2em]">
                                                            {currentOptions.map((option, idx) => {
                                                                let btnClass = "w-full py-[0.1em] px-[0.2em] border rounded-lg transition-all font-arabic text-center leading-normal ";

                                                                if (wordResult) {
                                                                    btnClass += "cursor-default ";
                                                                    if (option === wordData.berharakat) {
                                                                        btnClass += "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border-green-500 font-bold ";
                                                                    } else if (wordResult.status === 'wrong' && option === wordResult.selectedOption) {
                                                                        btnClass += "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500 ";
                                                                    } else {
                                                                        btnClass += "bg-gray-50 text-gray-400 border-gray-100 dark:bg-slate-800/50 dark:text-gray-600 dark:border-slate-700 opacity-50 ";
                                                                    }
                                                                } else {
                                                                    btnClass += "bg-gray-50 hover:bg-teal-50 dark:bg-slate-700 dark:hover:bg-teal-900/30 border-gray-200 dark:border-slate-600 hover:border-teal-300 active:scale-95 cursor-pointer text-gray-800 dark:text-gray-200 ";
                                                                }

                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={(e) => !wordResult && handleOptionSelect(option, e)}
                                                                        className={btnClass}
                                                                        disabled={!!wordResult}
                                                                    >
                                                                        {option}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </span>
                                    );
                                })}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasykilMode;
