import React, { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ngalogatSymbolColors from '../data/ngalogat-symbol-colors.json'; // Import ngalogatSymbolColors
import { appConfig } from '../config/app-config';

export const AppContext = createContext();

const defaultSettings = {
  ...appConfig.defaultFeatures,
  ...appConfig.defaultTextSettings
};

// Function to apply settings to the DOM
const applySettingsToDOM = (settings) => {
  document.documentElement.style.setProperty('--arabic-font-size', `${settings.arabicSize}rem`);
  document.documentElement.style.setProperty('--tooltip-font-size', `${settings.tooltipSize}rem`);
  document.documentElement.style.setProperty('--arabic-line-height', settings.lineHeight);
  document.documentElement.style.setProperty('--word-spacing', `${settings.wordSpacing}rem`);
  document.documentElement.style.setProperty('--irab-font-size', `${settings.irabSize}rem`);
  // Calculate nga-logat size proportional to arabic size (approx 55%)
  const ngaLogatSize = settings.arabicSize * 0.55;
  document.documentElement.style.setProperty('--ngalogat-font-size', `${ngaLogatSize}rem`);

  // Font Family
  if (settings.arabicFontFamily) {
    document.documentElement.style.setProperty('--arabic-font-family', settings.arabicFontFamily);
  } else {
    document.documentElement.style.setProperty('--arabic-font-family', '"Noto Naskh Arabic", serif');
  }

  // Layout Spacing (Toasts)
  document.documentElement.style.setProperty('--toast-padding-top', appConfig.layout.pt_toast);
  document.documentElement.style.setProperty('--toast-margin-bottom', appConfig.layout.mb_toast);
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [completedLessons, setCompletedLessons] = useLocalStorage('completedLessons', []);
  const [settings, setSettings] = useLocalStorage('soroganAppSettings', defaultSettings);

  // Apply theme on initial load and when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  // Apply display settings on initial load and when they change
  useEffect(() => {
    applySettingsToDOM(settings);
  }, [settings]);

  // Set App Name to Document Title
  useEffect(() => {
    document.title = appConfig.appName;
  }, []);

  // Ensure new default settings (like isSoundEnabled) are merged for existing users
  useEffect(() => {
    setSettings(prev => ({ ...defaultSettings, ...prev }));
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLessonComplete = (lessonId) => {
    setCompletedLessons(prev =>
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  const resetProgress = () => {
    // Clear all relevant local storage items to ensure a full reset
    localStorage.removeItem('theme');
    localStorage.removeItem('completedLessons');
    localStorage.removeItem('soroganAppSettings');
    localStorage.removeItem('hasSeenTutorial'); // Also clear tutorial status

    // Reload the page to apply changes from a clean slate, mimicking vanilla app behavior
    window.location.reload();
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  // Add a timestamp for reset event to trigger UI updates even if values don't change
  const [lastReset, setLastReset] = React.useState(Date.now());

  const resetSettings = () => {
    setSettings(defaultSettings);
    setLastReset(Date.now());
  }

  const value = {
    theme,
    toggleTheme,
    completedLessons,
    toggleLessonComplete,
    resetProgress,
    settings,
    updateSettings,
    resetSettings,
    lastReset, // Expose this
    ngalogatSymbolColors, // Add this
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
