import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationRO from './locales/ro/translation.json';
import translationDE from "./locales/de/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  ro: {
    translation: translationRO,
  },
  de: {
    translation: translationDE,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false,
    },
  });


export default i18n;
