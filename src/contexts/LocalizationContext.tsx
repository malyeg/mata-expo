import React, { createContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LoggerFactory } from "../utils/logger";

export enum Locale {
  EN = "en",
  AR = "ar",
}

export interface ILocalizationContextModel {
  t: (key: string, options?: any) => string;
  locale: string;
  supportedLocales: string[];
  toggleLocale: (forceRestart?: boolean) => void;
}

const logger = LoggerFactory.getLogger("LocalizationContext");
const LocalizationContext = createContext({} as ILocalizationContextModel);
interface LocalizationProviderProps {
  children: ReactNode;
}
// const restart = () => {
//   RNRestart.Restart();
// };
const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const [tr, i18n] = useTranslation();
  const [locale, setLocale] = React.useState(i18n.language);

  // const updateLocale = async (loc: string, forceRestart: boolean = false) => {
  //   logger.debug('setLocale: locale before', loc);
  //   await setLocale(loc);
  //   await i18n.changeLanguage(loc);
  //   await AsyncStorage.setItem(constants.locale.STORAGE_NAME, loc);
  //   await I18nManager.forceRTL(loc === Locale.AR);
  //   !!forceRestart && (await restart());
  // };

  const localizationContext = React.useMemo(
    () => ({
      t: (key: string, options?: any) => {
        return tr(key, { locale, ...options });
      },
      supportedLocales: Object.keys(i18n.services.resourceStore.data),
    }),
    [i18n.services.resourceStore.data, locale, tr]
  );

  return (
    <LocalizationContext.Provider value={{ locale, ...localizationContext }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export { LocalizationContext, LocalizationProvider };
