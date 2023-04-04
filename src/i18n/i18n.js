import { enUS as locale_enUS } from "date-fns/locale";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translations: en },
  },
  fallbackLng: "en",
  debug: false,
  ns: ["translations"],
  defaultNS: "translations",
  fallbackNS: "translations",
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

const dateFormats = {
  en: {
    date: "dd/MM/yyyy",
    time: "hh:mm aa",
    complete: "dd/MM/yyyy hh:mm aa",
  }
};

const locales = {
  en: locale_enUS,
};

export const getDateFormat = () => {
  return (dateFormats[i18n.language || "en"] || dateFormats.en).date;
};

export const getTimeFormat = () => {
  return (dateFormats[i18n.language || "en"] || dateFormats.en).time;
};

export const getDateTimeFormat = () => {
  return (dateFormats[i18n.language || "en"] || dateFormats.en).complete;
};

export const getLocale = () => {
  return locales[i18n.language || "en"] || locales.en;
};
