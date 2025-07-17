import theme from "@/styles/theme";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Icon, Text } from "../core";

interface FilterIconProps extends PressableProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  label?: string;
}
const FilterIcon = ({ onPress, label, style, ...props }: FilterIconProps) => {
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      hitSlop={5}
      {...props}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <Icon
        name={"filter"}
        size={30}
        color={theme.colors.dark}
        onPress={onPress}
        type="custom"
      />
    </Pressable>
  );
};

export default FilterIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  label: {
    marginRight: 10,
  },
});
