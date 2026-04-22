import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import esMX from './locales/es-MX.json';
import ptBR from './locales/pt-BR.json';
import pageFlipEn from './locales/pageFlip-en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, pageFlip: pageFlipEn },
      'es-MX': { translation: esMX },
      'pt-BR': { translation: ptBR },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
