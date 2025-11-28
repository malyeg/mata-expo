import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locale } from "../config/constants";

import ar from "./ar/ar";
import en from "./en/en";

const resources = {
  en: en,
  ar: ar,
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  ns: ["common"],
  lng: locale.DEFAULT_LANGUAGE,
  fallbackLng: locale.FALLBACK_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
