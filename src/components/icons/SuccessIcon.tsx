import theme from "@/styles/theme";
import { BaseViewProps } from "@/types/ReactTypes";
import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "../core/Icon";
interface SuccessIconProps extends BaseViewProps {
  name?: string;
}
const SuccessIcon = ({ style, name }: SuccessIconProps) => {
  return (
    <View style={[styles.headerIconContainer, style]}>
      <View style={styles.headerIconInnerContainer}>
        <Icon
          name={name ?? "check-circle-outline"}
          color={theme.colors.green}
          style={styles.headerIcon}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerIconContainer: {
    // padding: 10,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconInnerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 35,
  },
  headerIcon: {
    fontSize: 70,
  },
});
export default SuccessIcon;
