import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useBookData } from '../hooks/useBookData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import { Menu, Settings, BookOpen, PlayCircle, Globe, Type, ChevronRight, ChevronLeft, RotateCcw, Home, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

import LessonContent from '../components/learning/LessonContent';
import TasykilMode from '../components/learning/TasykilMode';
import FullTranslation from '../components/learning/FullTranslation';
import LearningToolbar from '../components/learning/LearningToolbar';
import DisplaySettings from '../components/ui/DisplaySettings';
import LessonSkeleton from '../components/skeletons/LessonSkeleton';
import Tutorial from '../components/ui/Tutorial';
import Quiz from '../components/learning/Quiz';
import ThemeToggle from '../components/ui/ThemeToggle';

// Komponen Daftar Isi
const TableOfContents = ({ chapters, onChapterSelect, activeChapterTitle, languageMode, setLanguageMode }) => {
    // State to track expanded sub-chapter groups
    const [expandedGroups, setExpandedGroups] = useState({});

    // Auto-expand group if active chapter is inside it
    useEffect(() => {
        const activeCh = chapters.find(ch => ch.title === activeChapterTitle);
        if (activeCh && activeCh.groupId) {
            setExpandedGroups(prev => ({ ...prev, [activeCh.groupId]: true }));
        }
    }, [activeChapterTitle, chapters]);

    const toggleGroup = (groupId, e) => {
        e.stopPropagation();
        setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-col gap-3 mb-2 px-2 pb-4 border-b border-teal-500/30">
                {/* Tombol Kembali ke Beranda */}
                <Link to="/" className="w-full">
                    <Button variant="outline" className="w-full gap-2 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                        <Home className="w-4 h-4 relative z-10" />
                        <span className="relative z-10 font-bold">Kembali ke Beranda</span>
                    </Button>
                </Link>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400">Daftar Isi</h2>
                    </div>

                    {/* Toggle Bahasa Judul (Ikon Saja) */}
                    <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setLanguageMode('latin')}
                            title="Tampilkan Latin"
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-lg font-bold transition-all ${languageMode === 'latin' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-700 dark:text-teal-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                        >
                            A
                        </button>
                        <button
                            onClick={() => setLanguageMode('arabic')}
                            title="Tampilkan Arab"
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-xl font-arabic transition-all ${languageMode === 'arabic' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-700 dark:text-teal-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                        >
                            ع
                        </button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 w-full rounded-md mt-2">
                <div className="flex flex-col gap-1 pr-4 pb-8">
                    {chapters.map((chapter, index) => {
                        const isActive = activeChapterTitle === chapter.title;
                        const displayTitle = languageMode === 'arabic' ? (chapter.titleArabic || chapter.title) : chapter.title;

                        const isSubChapter = chapter.isSubChapter;
                        const isParent = chapter.isParent;
                        const groupId = chapter.groupId;
                        const isExpanded = expandedGroups[groupId] || false;

                        // Jika ini sub-bab tapi parent-nya tidak expanded, jangan render
                        if (isSubChapter && !isExpanded) return null;

                        // Styling spesifik untuk Sub-Bab (menjorok ke dalam)
                        let subChapterStyles = '';
                        if (isSubChapter) {
                            subChapterStyles = languageMode === 'arabic'
                                ? 'pr-8 text-sm opacity-90'
                                : 'pl-8 text-xs opacity-90 relative before:content-[""] before:absolute before:left-3 before:top-1/2 before:w-3 before:h-px before:bg-gray-300 dark:before:bg-gray-600';
                        } else {
                            subChapterStyles = 'font-medium mt-1';
                        }

                        return (
                            <div key={chapter.id || index} className="relative w-full flex items-center justify-between group">
                                <button
                                    onClick={() => onChapterSelect(chapter.title)}
                                    className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md font-semibold translate-x-1'
                                        : 'hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-slate-800 dark:hover:text-teal-400 text-gray-700 dark:text-gray-300'
                                        } ${languageMode === 'arabic' ? 'font-arabic text-right text-lg' : 'text-sm'} ${subChapterStyles} ${isParent ? (languageMode === 'arabic' ? 'pl-8' : 'pr-8') : ''}`}
                                    dir={languageMode === 'arabic' ? 'rtl' : 'ltr'}
                                >
                                    {displayTitle}
                                </button>

                                {isParent && (
                                    <button
                                        onClick={(e) => toggleGroup(groupId, e)}
                                        className={`absolute flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-teal-600 hover:bg-teal-200 dark:hover:bg-slate-700 transition-transform duration-200 ${languageMode === 'arabic' ? 'left-2' : 'right-2'} ${isExpanded ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''}`}
                                    >
                                        <ChevronDown size={16} />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

const BookPage = ({ setSliderState }) => {
    const { allChapters } = useBookData();
    const { settings, updateSettings, resetSettings } = useContext(AppContext);
    const [showFullTranslation, setShowFullTranslation] = useLocalStorage('sorogan_showFullTranslation', false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk mobile TOC
    const [isToolbarOpen, setIsToolbarOpen] = useState(false); // Untuk mobile Toolbar
    const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false); // Untuk Nested Advanced Settings

    const [activeChapter, setActiveChapter] = useState(null);
    const [isQuizMode, setQuizMode] = useState(false);
    const [titleLanguageMode, setTitleLanguageMode] = useLocalStorage('sorogan_titleLanguageMode', 'latin'); // 'latin' or 'arabic'

    const [globalFocusId, setGlobalFocusId] = useState(null);

    // Desktop collapsible sidebars
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useLocalStorage('sorogan_leftSidebarCollapsed', false);
    const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useLocalStorage('sorogan_rightSidebarCollapsed', false);

    const observerRef = useRef(null);

    const handleSmoothScroll = (title) => {
        const elementId = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const element = document.getElementById(elementId);
        if (element) {
            const yOffset = -80; // Dikembalikan cukup untuk sticky header Bab saja
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setIsSidebarOpen(false);
    };

    // Mount Effect: Cek URL hash lalu local storage saat pertama kali buka kitab
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#')) {
            // Jika ada hash di URL, scroll ke sana setelah DOM siap
            const chapterId = hash.substring(1);
            const found = allChapters.find(ch => ch.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() === chapterId);
            if (found) {
                setTimeout(() => handleSmoothScroll(found.title), 300);
                return;
            }
        }

        // Fallback: cek riwayat bacaan terakhir
        const saved = localStorage.getItem('lastReadChapter');
        if (saved) {
            setTimeout(() => handleSmoothScroll(saved), 300);
        } else {
            window.scrollTo(0, 0);
        }
    }, [allChapters]);

    // FullScreen Exit Effect: Kembalikan scroll saat tutup Kuis/Tasykil
    useEffect(() => {
        if (!isQuizMode && !settings.isTasykilMode) {
            const saved = localStorage.getItem('lastReadChapter');
            if (saved) {
                setTimeout(() => handleSmoothScroll(saved), 150);
            }
        }
    }, [isQuizMode, settings.isTasykilMode]);

    // Intersection Observer untuk mendeteksi bab mana yang sedang dibaca
    useEffect(() => {
        // Jika sedang mode full-screen, tidak perlu observe karena article disembunyikan
        if (!allChapters || allChapters.length === 0 || isQuizMode || settings.isTasykilMode) return;

        if (!activeChapter) {
            setActiveChapter(allChapters[0]);
        }

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const chapterId = entry.target.id;
                    const found = allChapters.find(ch => ch.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() === chapterId);
                    if (found) {
                        setActiveChapter(found);
                        localStorage.setItem('lastReadChapter', found.title);
                        // Update URL hash secara siluman tanpa menambah riwayat browser
                        window.history.replaceState(null, '', '#' + entry.target.id);
                    }
                }
            });
        };

        observerRef.current = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Aktif ketika elemen berada kira-kira di bagian atas-tengah layar
            threshold: 0,
        });

        // setTimeout memastikan DOM sudah benar-benar ter-mount setelah exit dari full-screen mode
        const timeoutId = setTimeout(() => {
            const articles = document.querySelectorAll('article[id]');
            articles.forEach(el => {
                if (observerRef.current) observerRef.current.observe(el);
            });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [allChapters, isQuizMode, settings.isTasykilMode]);

    // Auto-update globalFocusId appropriately when activeChapter changes in Focus Mode
    useEffect(() => {
        if (settings.isFocusMode && activeChapter) {
            const activeChapterPrefix = `${activeChapter.id || activeChapter.title}-`;
            if (!globalFocusId || !globalFocusId.startsWith(activeChapterPrefix)) {
                setGlobalFocusId(`${activeChapter.id || activeChapter.title}-0`);
            }
        }
    }, [settings.isFocusMode, activeChapter]);



    if (!allChapters || allChapters.length === 0) {
        return <LessonSkeleton />;
    }

    if (isQuizMode && activeChapter) {
        return (
            <div className="fixed inset-0 z-[100] bg-gradient-light dark:bg-gradient-dark overflow-y-auto w-full h-full">
                <Quiz
                    lessonData={activeChapter}
                    onFinishQuiz={() => {
                        setQuizMode(false);
                        window.scrollTo(0, 0);
                    }}
                    lessonId={activeChapter.id}
                />
            </div>
        );
    }

    // TasykilMode Full Screen Isolation
    if (settings.isTasykilMode && activeChapter) {
        return (
            <div className="fixed inset-0 z-[100] bg-gradient-light dark:bg-gradient-dark overflow-y-auto w-full h-full">
                <TasykilMode
                    lessonData={activeChapter}
                    setSliderState={setSliderState}
                />
            </div>
        );
    }

    // Tentukan teks sticky header
    const stickyHeaderText = activeChapter
        ? (titleLanguageMode === 'arabic' ? (activeChapter.titleArabic || activeChapter.title) : activeChapter.title)
        : 'Memuat...';

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full !pt-0">

            <div className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out sticky self-start h-[calc(100vh-2rem)] top-6 ${isLeftSidebarCollapsed ? 'w-0' : 'w-72 px-4'}`}>
                {/* Toggle Button for Left Sidebar */}
                <button
                    onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-teal-600 rounded-full p-1.5 shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    title={isLeftSidebarCollapsed ? "Tampilkan Daftar Isi" : "Sembunyikan Daftar Isi"}
                >
                    {isLeftSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                <div className={`w-full h-full overflow-hidden transition-opacity duration-200 ${isLeftSidebarCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                    <TableOfContents
                        chapters={allChapters}
                        onChapterSelect={handleSmoothScroll}
                        activeChapterTitle={activeChapter?.title}
                        languageMode={titleLanguageMode}
                        setLanguageMode={setTitleLanguageMode}
                    />
                </div>
            </div>

            {/* TENGAH: Area Baca Utama (Continuous Scrolling) */}
            <main className={`flex-1 transition-all duration-300 ease-in-out px-4 md:px-8 max-w-5xl mx-auto min-w-0 pb-32`}>

                {/* Sticky Header untuk Judul Bab Aktif & Mobile Triggers */}
                <div
                    className={`sticky z-30 transition-all duration-300 ease-in-out bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm w-[calc(100%+2rem)] -ml-4 md:w-full md:ml-0 py-3 md:py-4 px-4 md:px-8 mb-4 md:mb-6 flex items-center justify-between rounded-b-xl md:rounded-b-3xl border-b border-gray-200 dark:border-slate-800 top-0`}
                >
                    {/* Tombol TOC di Mobile (Kiri) */}
                    <div className="md:hidden flex-none">
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col pt-12">
                                <SheetTitle className="sr-only">Daftar Isi</SheetTitle>
                                <TableOfContents
                                    chapters={allChapters}
                                    onChapterSelect={handleSmoothScroll}
                                    activeChapterTitle={activeChapter?.title}
                                    languageMode={titleLanguageMode}
                                    setLanguageMode={setTitleLanguageMode}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Judul Bab Tengah */}
                    <h1
                        className={`text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${titleLanguageMode === 'arabic' ? 'from-teal-600 to-sky-600 font-arabic tracking-wide' : 'from-teal-600 to-emerald-600 tracking-tight'} text-center flex-1 line-clamp-1 px-2`}
                        dir={titleLanguageMode === 'arabic' ? "rtl" : "ltr"}
                    >
                        {stickyHeaderText}
                    </h1>

                    {/* Tombol Pengaturan di Mobile (Kanan) */}
                    <div className="md:hidden flex-none">
                        <Sheet open={isToolbarOpen} onOpenChange={setIsToolbarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800">
                                    <Settings className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-12 overflow-y-auto">
                                <SheetTitle className="sr-only">Pengaturan Baca</SheetTitle>

                                <div className="flex items-center justify-between mb-6 border-b pb-2 border-teal-500/30">
                                    <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400">Pengaturan Baca</h2>
                                    <ThemeToggle />
                                </div>

                                <div className="flex flex-col h-full">
                                    {isAdvancedSettingsOpen ? (
                                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                            <button
                                                onClick={() => setIsAdvancedSettingsOpen(false)}
                                                className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500 hover:text-teal-600 transition-colors w-fit rounded-lg py-1 pr-2"
                                            >
                                                <ChevronLeft className="w-5 h-5" /> Kembali
                                            </button>
                                            <DisplaySettings settings={settings} updateSettings={updateSettings} onReset={resetSettings} inline={true} isOpen={true} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300">
                                            <LearningToolbar
                                                settings={settings}
                                                updateSettings={updateSettings}
                                                onReset={resetSettings}
                                                isSettingsOpen={true}
                                                setSettingsOpen={() => { }}
                                                lessonData={activeChapter || allChapters[0]}
                                                showFullTranslation={showFullTranslation}
                                                setShowFullTranslation={setShowFullTranslation}
                                                compact={false}
                                                onOpenAdvancedSettings={() => setIsAdvancedSettingsOpen(true)}
                                            />

                                            <div className="mt-6 flex flex-col gap-3">
                                                {activeChapter?.textData?.some(p => p.some(w => w.tasykil_options?.length > 0)) && (
                                                    <Button
                                                        onClick={() => updateSettings({ isTasykilMode: true })}
                                                        className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                                                    >
                                                        <span className="font-arabic text-2xl mb-1">شَ</span> Mulai Mode Tasykil
                                                    </Button>
                                                )}

                                                {activeChapter?.quizData?.length > 0 && (
                                                    <Button
                                                        onClick={() => setQuizMode(true)}
                                                        className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                                                    >
                                                        <PlayCircle className="w-6 h-6" /> Mulai Kuis Ujian
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Single Seamless Paper Container */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-xl rounded-2xl p-6 md:p-10 min-h-[50vh] space-y-2 mt-4">
                    {allChapters.map((chapter, index) => {
                        const chapterId = chapter.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                        return (
                            <article key={chapter.id || index} id={chapterId} className="scroll-mt-32 relative">

                                <div className="mt-2">
                                    <LessonContent
                                        lessonData={chapter}
                                        setSliderState={setSliderState}
                                        globalFocusId={globalFocusId}
                                        setGlobalFocusId={setGlobalFocusId}
                                    />
                                    <div className={`transition-opacity duration-300 ${settings.isFocusMode ? 'paragraph-unfocused' : ''}`}>
                                        <FullTranslation text={chapter.fullTranslation || ''} isVisible={showFullTranslation} />
                                    </div>
                                </div>

                                {/* Pembatas antar bab */}
                                {index < allChapters.length - 1 && (
                                    <div className={allChapters[index + 1]?.isSubChapter ? 'py-4' : 'py-8'}>
                                        <Separator className={`mx-auto rounded-full ${allChapters[index + 1]?.isSubChapter ? 'w-1/6 bg-gray-100 dark:bg-slate-800 h-[1px]' : 'w-1/3 bg-gray-200 dark:bg-slate-700/50 h-[1px]'}`} />
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </main>

            {/* KANAN: Sidebar Toolbar (Desktop) */}
            <div className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out sticky self-start h-[calc(100vh-2rem)] top-6 ${isRightSidebarCollapsed ? 'w-0' : 'w-80 px-4'}`}>
                {/* Toggle Button for Right Sidebar */}
                <button
                    onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-teal-600 rounded-full p-1.5 shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    title={isRightSidebarCollapsed ? "Tampilkan Pengaturan Baca" : "Sembunyikan Pengaturan Baca"}
                >
                    {isRightSidebarCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>

                <div className={`w-full h-full overflow-hidden transition-opacity duration-200 ${isRightSidebarCollapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-100 dark:border-slate-700/60 shadow-lg rounded-3xl p-5 w-full h-[calc(100vh-4rem)] flex flex-col">
                        <div className="mb-5 flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-3 shrink-0">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
                                <Settings className="w-5 h-5" /> Pengaturan Baca
                            </h2>
                            <ThemeToggle />
                        </div>

                        <div className="flex-grow overflow-y-auto pb-4 pr-1 scrollbar-hide flex flex-col overflow-x-hidden">
                            {isAdvancedSettingsOpen ? (
                                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                    <button
                                        onClick={() => setIsAdvancedSettingsOpen(false)}
                                        className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500 hover:text-teal-600 transition-colors w-fit rounded-lg py-1 pr-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Kembali
                                    </button>
                                    <DisplaySettings settings={settings} updateSettings={updateSettings} onReset={resetSettings} inline={true} isOpen={true} />
                                </div>
                            ) : (
                                <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-300">
                                    {/* Toolbar Dirombak Vertikal */}
                                    <LearningToolbar
                                        settings={settings}
                                        updateSettings={updateSettings}
                                        onReset={resetSettings}
                                        isSettingsOpen={true} // Selalu terbuka di sidebar
                                        setSettingsOpen={() => { }} // dummy
                                        lessonData={activeChapter || allChapters[0]}
                                        showFullTranslation={showFullTranslation}
                                        setShowFullTranslation={setShowFullTranslation}
                                        compact={false}
                                        onOpenAdvancedSettings={() => setIsAdvancedSettingsOpen(true)}
                                    />

                                    <div className="mt-6 flex flex-col gap-3">
                                        {/* Tombol Mulai Tasykil */}
                                        {activeChapter?.textData?.some(p => p.some(w => w.tasykil_options?.length > 0)) && (
                                            <Button
                                                onClick={() => updateSettings({ isTasykilMode: true })}
                                                className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-6 rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 active:scale-95 text-base flex items-center justify-center p-0"
                                            >
                                                <span className="font-arabic text-2xl mb-1 mr-1">شَ</span> Mulai Mode Tasykil
                                            </Button>
                                        )}

                                        {/* Tombol Mulai Kuis untuk Desktop Toolbar */}
                                        {activeChapter?.quizData?.length > 0 && (
                                            <Button
                                                onClick={() => setQuizMode(true)}
                                                className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-6 rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 active:scale-95 text-base"
                                            >
                                                <PlayCircle className="w-6 h-6" /> Mulai Kuis Ujian
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Tutorial setSliderState={setSliderState} />
        </div>
    );
};

export default BookPage;
