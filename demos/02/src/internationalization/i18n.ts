// src/internationalization/i18n.ts — react-i18next bootstrap.
// Imported once in main.tsx before render.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

void i18n
  .use(HttpBackend) // lazy-load public/locales/<lng>/<ns>.json
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en'],
    ns: ['common', 'dashboard', 'trades'],
    defaultNS: 'common',
    interpolation: { escapeValue: false }, // React already escapes
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
  });

export default i18n;
