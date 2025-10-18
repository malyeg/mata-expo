import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import theme from "../../styles/theme";

interface ChevronProps {
  direction?: "left" | "right";
  style?: StyleProp<TextStyle>;
  size?: number;
  onPress?: () => void;
}
const Chevron = ({
  direction = "right",
  size,
  style,
  onPress,
}: ChevronProps) => {
  const iconName = ("chevron-" + direction) as (typeof Icon)["name"];
  return (
    <Icon
      name={iconName}
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
