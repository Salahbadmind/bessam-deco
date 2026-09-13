import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, Language, SiteSettings } from '../types';
import { TRANSLATIONS, TranslationStructure } from '../i18n/translations';

interface ThemeLanguageContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: TranslationStructure;
  siteSettings: SiteSettings | null;
  refreshSiteSettings: () => Promise<void>;
  updateSiteSettingsState: (settings: SiteSettings) => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('bessam_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // ignore
    }
    return 'dark';
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bessam_lang');
      if (saved === 'fr' || saved === 'en' || saved === 'ar') return saved;
    } catch (e) {
      // ignore
    }
    return 'fr';
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Sync theme to DOM
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('bessam_theme', newTheme);
    } catch (e) {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    }
  }, [theme]);

  // Sync language and direction to DOM
  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('bessam_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Load site settings from API
  const refreshSiteSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(data);
      }
    } catch (err) {
      console.warn('Could not load dynamic settings:', err);
    }
  };

  useEffect(() => {
    refreshSiteSettings();
  }, []);

  // Handle custom CSS & custom scripts injection if provided in siteSettings
  useEffect(() => {
    if (siteSettings?.custom_css) {
      let styleTag = document.getElementById('bessam-dynamic-css') as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'bessam-dynamic-css';
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = siteSettings.custom_css;
    }
  }, [siteSettings?.custom_css]);

  const updateSiteSettingsState = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        language,
        setLanguage,
        dir,
        t,
        siteSettings,
        refreshSiteSettings,
        updateSiteSettingsState,
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
