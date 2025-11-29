import i18n from "@/locales/i18n";
import { Timestamp } from "@react-native-firebase/firestore";
import { format as dateFnsFormat } from "date-fns";
import { ar, enUS } from "date-fns/locale";

const locales: Record<string, Locale> = {
  ar: ar,
  en: enUS,
};

function getDateLocale(): Locale {
  return locales[i18n.language] || enUS;
}

function formatDate(
  date: Date | Timestamp | number,
  formatStr: string
): string {
  const dateObj =
    date instanceof Timestamp
      ? date.toDate()
      : date instanceof Date
        ? date
        : new Date(date);

  return dateFnsFormat(dateObj, formatStr, { locale: getDateLocale() });
}

function timeAgo(date: Date | Timestamp): string {
  if (date instanceof Timestamp) {
    date = date.toDate();
  } else if (!(date instanceof Date)) {
    throw new Error("Invalid date type. Expected Date or Timestamp.");
  }
  const ms = new Date().getTime() - date.getTime();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  // Use i18n directly for translation
  const translate = (key: string, count: number) => {
    return i18n.t(`common:timeAgo.${key}`, { count });
  };

  if (ms === 0) {
    return i18n.t("common:timeAgo.justNow");
  }
  if (seconds < 60) {
    return translate("seconds", seconds);
  }
  if (minutes < 60) {
    return translate("minutes", minutes);
  }
  if (hours < 24) {
    return translate("hours", hours);
  }
  if (days < 30) {
    return translate("days", days);
  }
  if (months < 12) {
    return translate("months", months);
  } else {
    return translate("years", years);
  }
}

export default timeAgo;
export { timeAgo, formatDate, getDateLocale };
