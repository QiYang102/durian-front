import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enUser from '../locales/en/user.json';
import zhUser from '../locales/zh/user.json';
import enCommon from '../locales/en/common.json';
import zhCommon from '../locales/zh/common.json';
import enProfile from '../locales/en/profile.json';
import zhProfile from '../locales/zh/profile.json';


const resources = {
  en: {
    user: enUser,
    common: enCommon,
    profile : enProfile
  },
  zh: {
    user: zhUser,
    common: zhCommon,
    profile : zhProfile
  }
};

i18n
  .use(LanguageDetector) // Automatically detect user's language
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    resources,
    
    // Default language
    fallbackLng: 'en',
    
    // Default namespace
    defaultNS: 'common',
    
    // Available namespaces
    ns: ['common', 'user'],
    
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, 
    },
    
    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Cache language in localStorage
      caches: ['localStorage'],
      
      // Key to store language in localStorage
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;