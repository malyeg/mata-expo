import { Loader } from "@/components/core";
import Chevron from "@/components/icons/Chevron";
import constants from "@/config/constants";
import theme from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

const PrivacyScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const onLoadEnd = () => {
    setLoading(false);
  };
  const goBack = () => {
    router.back();
  };

  return (
    <>
      <WebView
        onLoadEnd={onLoadEnd}
        style={styles.webView}
        source={{ uri: constants.legalInfo.PRIVACY_URL }}
      />
      <Chevron
        direction="left"
        // size={50}
        style={styles.chevron}
        onPress={goBack}
      />
      {loading && <Loader />}
    </>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  webView: {},
  chevron: {
    position: "absolute",
    top: 0,
    left: 0,
    color: theme.colors.grey,
    fontSize: 35,
    marginTop: 10,
  },
});
