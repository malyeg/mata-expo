import { Icon, Modal, Text } from "@/components/core";
import { ChevronIcon } from "@/components/core/Icon";
import useLanguage, { SupportedLanguage } from "@/hooks/useLanguage";
import theme from "@/styles/theme";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type LanguageOption = {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
};

const languages: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
];

type LanguageSwitcherProps = {
  showLabel?: boolean;
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  showLabel = true,
}) => {
  const { currentLanguage, changeLanguage, isChanging } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = languages.find((l) => l.code === currentLanguage);

  const handleLanguageSelect = async (language: SupportedLanguage) => {
    setModalVisible(false);
    if (language !== currentLanguage) {
      await changeLanguage(language);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  if (isChanging) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={openModal}
        activeOpacity={0.7}
      >
        <Icon name="translate" size={24} color={theme.colors.primary} />
        {showLabel && (
          <Text style={styles.label}>{currentLang?.nativeLabel}</Text>
        )}
        <ChevronIcon size={20} color={theme.colors.grey} />
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        onClose={closeModal}
        position="bottom"
        title="Select Language"
      >
        <View style={styles.modalContent}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                currentLanguage === lang.code && styles.selectedOption,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
              activeOpacity={0.7}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.languageLabel}>{lang.label}</Text>
                <Text style={styles.nativeLabel}>{lang.nativeLabel}</Text>
              </View>
              {currentLanguage === lang.code && (
                <Icon name="check" size={24} color={theme.colors.secondary} />
              )}
            </TouchableOpacity>
          ))}
          <Text style={styles.warningText}>
            Changing language will restart the app
          </Text>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.dark,
  },
  modalContent: {
    paddingVertical: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGrey,
  },
  selectedOption: {
    backgroundColor: theme.colors.lightGrey,
  },
  languageInfo: {
    gap: 4,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.dark,
  },
  nativeLabel: {
    fontSize: 14,
    color: theme.colors.grey,
  },
  warningText: {
    fontSize: 12,
    color: theme.colors.grey,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    fontStyle: "italic",
  },
});

export default LanguageSwitcher;
