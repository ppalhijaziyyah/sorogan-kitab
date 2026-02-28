import React, { useMemo } from 'react';

const LearningToolbar = ({
  settings,
  updateSettings,
  onReset,
  isSettingsOpen,
  setSettingsOpen,
  lessonData,
  showFullTranslation,
  setShowFullTranslation,
  onOpenAdvancedSettings
}) => {

  const handleHarakatModeToggle = () => {
    const newIsHarakatMode = !settings.isHarakatMode;
    updateSettings({
      isHarakatMode: newIsHarakatMode,
      showAllHarakat: newIsHarakatMode ? settings.showAllHarakat : false
    });
  };

  const handleTranslationModeToggle = () => {
    const newIsTranslationMode = !settings.isTranslationMode;
    updateSettings({
      isTranslationMode: newIsTranslationMode,
      showAllTranslations: newIsTranslationMode ? settings.showAllTranslations : false
    });
  };

  const hasNgaLogatData = useMemo(() => {
    return lessonData?.textData?.some(paragraph =>
      paragraph.some(wordData => wordData.nga_logat && wordData.nga_logat.length > 0)
    );
  }, [lessonData]);

  // Tombol Toggle Interaktif Teks
  const interactiveButtons = [
    {
      id: 'harakat',
      isActive: settings.isHarakatMode,
      onClick: handleHarakatModeToggle,
      label: 'Harakat',
      desc: 'Klik per kata',
      icon: <span className="font-arabic text-xl">{settings.isHarakatMode ? 'حَ' : 'ح'}</span>
    },
    {
      id: 'terjemahan',
      isActive: settings.isTranslationMode,
      onClick: handleTranslationModeToggle,
      label: 'Terjemah',
      desc: 'Klik per kata',
      icon: (
        <div className="relative w-6 h-6 flex items-center justify-center">
          <span className="font-bold text-lg">T</span>
          {!settings.isTranslationMode && <div className="absolute inset-0 w-full h-[2px] bg-red-500 rotate-45 top-1/2 -translate-y-1/2 rounded-full z-10"></div>}
        </div>
      )
    }
  ];

  if (hasNgaLogatData) {
    interactiveButtons.push({
      id: 'ngalogat',
      isActive: settings.isNgaLogatMode,
      onClick: () => updateSettings({ isNgaLogatMode: !settings.isNgaLogatMode, showAllNgaLogat: settings.isNgaLogatMode ? false : settings.showAllNgaLogat }),
      label: 'Nga-logat',
      desc: 'Klik per kata',
      icon: <span className="font-arabic text-xl">{settings.isNgaLogatMode ? 'نَ' : 'ن'}</span>
    });
  }

  // Cek apakah ada Full Translation
  if (lessonData?.fullTranslation) {
    interactiveButtons.push({
      id: 'fulltrans',
      isActive: showFullTranslation,
      onClick: () => setShowFullTranslation(s => !s),
      label: 'Terjemah Utuh',
      desc: 'Paragraf utuh',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0zM1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5z" />
          <path d="M2 12h12v1h-12zm2-3h8v1h-8zm-2-3h12v1h-12zm2-3h8v1h-8z" />
        </svg>
      )
    });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Mode Interaksi Teks Utama */}
      <div>
        <div className="grid grid-cols-2 gap-2">
          {interactiveButtons.map(btn => (
            <button
              key={btn.id}
              onClick={btn.onClick}
              title={btn.desc}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${btn.isActive
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                : 'border-transparent bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-gray-200 dark:hover:border-slate-600'
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${btn.isActive ? 'bg-teal-100 dark:bg-teal-800' : 'bg-white dark:bg-slate-800 shadow-sm'}`}>
                {btn.icon}
              </div>
              <span className="text-xs font-semibold text-center leading-tight">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Pemilihan Tipografi Arab */}
      <div className="w-full">
        <label htmlFor="arabic-font-select" className="block text-xs font-semibold text-gray-500 mb-2">
          Gaya Huruf Arab
        </label>
        <div className="relative">
          <select
            id="arabic-font-select"
            value={settings.arabicFontFamily || '"Noto Naskh Arabic", serif'}
            onChange={(e) => updateSettings({ arabicFontFamily: e.target.value })}
            className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors font-medium"
          >
            <option value='"Noto Naskh Arabic", serif'>Noto Naskh (Standar)</option>
            <option value='"Amiri", serif'>Amiri (Klasik)</option>
            <option value='"Lateef", serif'>Lateef (Lugas)</option>
            <option value='"Scheherazade New", serif'>Scheherazade (Tebal)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* 3. Tombol Menuju Pengaturan Lanjut */}
      <div className="w-full">
        <button
          onClick={onOpenAdvancedSettings}
          className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
          Pengaturan Lanjutan
        </button>
      </div>
    </div>
  );
};

export default LearningToolbar;
