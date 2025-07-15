import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: require('../locales/en/translation.json')
      },
      fr: {
        translation: require('../locales/fr/translation.json')
      },
      wo: {
        translation: require('../locales/wo/translation.json')
      },
      mnk: {
        translation: require('../locales/mnk/translation.json')
      }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 