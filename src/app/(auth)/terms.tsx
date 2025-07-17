import React, { useState } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { Loader } from "@/components/core";
import Chevron from "@/components/icons/Chevron";
import constants from "@/config/constants";
import theme from "@/styles/theme";
import { useRouter } from "expo-router";

const TermsScreen = () => {
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
        source={{ uri: constants.legalInfo.TERMS_URL }}
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

export default TermsScreen;

const styles = StyleSheet.create({
  modal: {},
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
