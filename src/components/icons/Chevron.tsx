import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import theme from "../../styles/theme";

interface ChevronProps {
  direction?: "left" | "right";
  style?: StyleProp<TextStyle>;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
}
const Chevron = ({
  direction = "right",
  size,
  disabled,
  style,
  onPress,
}: ChevronProps) => {
  const iconName = ("chevron-" + direction) as (typeof Icon)["name"];
  return (
    <Icon
      name={iconName}
      disabled={disabled}
      color={theme.colors.grey}
      style={[styles.icon, style]}
      size={size}
      onPress={onPress}
    />
  );
};

export default Chevron;

const styles = StyleSheet.create({
  icon: {
    fontSize: 30,
  },
});
