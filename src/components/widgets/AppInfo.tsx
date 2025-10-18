import theme from "@/styles/theme";
import { BaseViewProps } from "@/types/ReactTypes";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DeviceInfo from "react-native-device-info";

interface AppInfoProps extends BaseViewProps {}
const AppInfo = ({ style }: AppInfoProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text>{DeviceInfo.getBuildNumber()}</Text>
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
