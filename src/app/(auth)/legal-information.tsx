import { Screen, Text } from "@/components/core";
import Card from "@/components/core/Card";
import constants from "@/config/constants";
import useLocale from "@/hooks/useLocale";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Linking, StyleSheet } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const LegalInformationScreen = () => {
  const router = useRouter();
  const { t } = useLocale("LegalInformationScreen");

  const openPrivacy = () => {
    Linking.openURL(constants.legalInfo.PRIVACY_URL);
  };
  const openTerms = () => {
    Linking.openURL(constants.legalInfo.TERMS_URL);
  };

  return (
    <Screen style={styles.screen}>
      <Text style={[styles.header, styles.header1]}>{t("header1")}</Text>
      <Text style={[styles.header, styles.header2]}>{t("header2")}</Text>
      <Card style={styles.card} onPress={openPrivacy}>
        <Text style={styles.cardLabel}>{t("privacyTitle")}</Text>
      </Card>
      <Card style={styles.card} onPress={openTerms}>
        <Text style={styles.cardLabel}>{t("termsTitle")}</Text>
      </Card>
    </Screen>
  );
};

export default LegalInformationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    fontSize: 16,
    textAlign: "left",
  },
  header1: {
    fontWeight: "bold",
    marginVertical: 5,
  },
  header2: {
    marginBottom: 20,
  },
  card: {
    paddingVertical: 15,
    paddingLeft: 20,
    marginVertical: 5,
  },
  cardLabel: {
    fontWeight: "bold",
  },
  more: {
    position: "absolute",
    bottom: 10,
    right: SCREEN_WIDTH / 2 - 50,
  },
});
