import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {locale} from '../config/constants';

import en from './en/en';
// import ar from '../locales/ar/ar';

const resources = {
  en: en,
  // en: {common: en}
  // ar: ar,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    ns: ['common'],
    // defaultNS: 'common',
    lng: locale.DEFAULT_LANGUAGE,
    fallbackLng: locale.FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
