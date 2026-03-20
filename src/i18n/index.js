import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import nlCommon from './locales/nl/common.json';
import nlForms  from './locales/nl/forms.json';
import nlErrors from './locales/nl/errors.json';
import enCommon from './locales/en/common.json';
import enForms  from './locales/en/forms.json';
import enErrors from './locales/en/errors.json';
import deCommon from './locales/de/common.json';
import deForms  from './locales/de/forms.json';
import deErrors from './locales/de/errors.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'nl',
    supportedLngs: ['nl', 'en', 'de'],
    defaultNS: 'common',
    ns: ['common', 'forms', 'errors'],
    resources: {
      nl: { common: nlCommon, forms: nlForms, errors: nlErrors },
      en: { common: enCommon, forms: enForms, errors: enErrors },
      de: { common: deCommon, forms: deForms, errors: deErrors },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'vrs-taal',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
