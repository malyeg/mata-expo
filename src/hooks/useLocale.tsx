import { useContext, useMemo } from "react";
import { LocalizationContext } from "../contexts/LocalizationContext";
import { useTranslation } from "react-i18next";
import i18n from "@/locales/i18n";

const NAMESPACE_SEPARATOR: string = ":";
type LocaleOptions = {
  defaultValue?: string;
  params?: { [key: string]: string };
  returnObjects?: boolean;
};
const useLocale = (ns?: string) => {
  // const {t, locale, supportedLocales} = useContext(LocalizationContext);
  const { t } = useTranslation();

  let keyPrefix = ns ? ns + NAMESPACE_SEPARATOR : "";

  const useLocaleResponse = useMemo(
    () => ({
      t: (key: string, options?: LocaleOptions) =>
        t(keyPrefix + key, { ...options, ...options?.params }),
    }),
    [keyPrefix, t]
  );

  return {
    locale: i18n.language,
    supportedLocales: Object.keys(i18n.services.resourceStore.data),
    ...useLocaleResponse,
  };
};

export default useLocale;
