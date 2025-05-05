import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
