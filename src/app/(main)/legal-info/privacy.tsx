import { Loader } from "@/components/core";
import constants from "@/config/constants";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

const PrivacyScreen = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const onLoadEnd = () => {
    console.log("onLoadEnd");
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

      {loading && <Loader />}
    </>
  );
};

export default PrivacyScreen;

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
