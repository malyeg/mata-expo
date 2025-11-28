import {useCallback, useEffect, useState} from 'react';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import * as Updates from 'expo-updates';
import i18n from '@/locales/i18n';
import {locale as localeConfig} from '@/config/constants';

export type SupportedLanguage = 'en' | 'ar';

const STORAGE_KEY = localeConfig.STORAGE_NAME;

/**
 * Get the initial language based on saved preference or device locale
 */
export const getInitialLanguage = async (): Promise<SupportedLanguage> => {
  try {
    // Check for saved preference first
    const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      return savedLanguage;
    }

    // Fall back to device locale
    const deviceLocale = Localization.getLocales()[0]?.languageCode;
    if (deviceLocale === 'ar') {
      return 'ar';
    }

    return 'en';
  } catch {
    return 'en';
  }
};

/**
 * Check if RTL should be enabled based on language
 */
export const isRTLLanguage = (language: SupportedLanguage): boolean => {
  return language === 'ar';
};

/**
 * Initialize RTL settings on app start (call before rendering)
 */
export const initializeRTL = async (): Promise<SupportedLanguage> => {
  const language = await getInitialLanguage();
  const shouldBeRTL = isRTLLanguage(language);

  // Set RTL if needed
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
  }

  // Set i18n language
  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }

  return language;
};

/**
 * Hook for managing language switching
 */
const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en',
  );
  const [isChanging, setIsChanging] = useState(false);

  const isRTL = I18nManager.isRTL;

  /**
   * Change language and handle RTL flip
   * This will trigger an app reload to properly apply RTL changes
   */
  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    if (language === currentLanguage) return;

    setIsChanging(true);

    try {
      // Save preference
      await AsyncStorage.setItem(STORAGE_KEY, language);

      // Change i18n language
      await i18n.changeLanguage(language);

      // Update RTL settings
      const shouldBeRTL = isRTLLanguage(language);
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);

      // Reload app to apply RTL changes
      // RTL changes require a full app restart to take effect
      if (__DEV__) {
        // In development, we need to manually reload
        // Note: This may not work perfectly in all dev scenarios
        await Updates.reloadAsync();
      } else {
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Failed to change language:', error);
      setIsChanging(false);
    }
  }, [currentLanguage]);

  /**
   * Toggle between English and Arabic
   */
  const toggleLanguage = useCallback(() => {
    const newLanguage: SupportedLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  }, [currentLanguage, changeLanguage]);

  // Sync with i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng as SupportedLanguage);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return {
    currentLanguage,
    isRTL,
    isChanging,
    changeLanguage,
    toggleLanguage,
    isArabic: currentLanguage === 'ar',
    isEnglish: currentLanguage === 'en',
  };
};

export default useLanguage;

