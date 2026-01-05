import theme from "@/styles/theme";
import { BaseViewProps } from "@/types/ReactTypes";
import Constants from "expo-constants";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface AppInfoProps extends BaseViewProps {}
const AppInfo = ({ style }: AppInfoProps) => {
  const buildNumber =
    Platform.OS === "ios"
      ? Constants.expoConfig?.ios?.buildNumber
      : Constants.expoConfig?.android?.versionCode;

  return (
    <View style={[styles.container, style]}>
      <Text>{buildNumber}</Text>
    </View>
  );
};

export default AppInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.grey,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
