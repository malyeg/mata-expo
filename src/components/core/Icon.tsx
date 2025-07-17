import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { SvgIcons } from "@/assets/svgs";

export type IconType = "materialCommunity" | "custom";
export interface IconProps {
  name: string;
  color?: string;
  size?: number;
  type?: IconType;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  bgColor?: string;
}
const Icon = ({
  name,
  color,
  size = 20,
  type = "materialCommunity",
  style,
  onPress,
}: IconProps) => {
  const SvgIcon = type === "custom" ? SvgIcons[name] : undefined;

  const iconExists =
    !!MaterialIcon.glyphMap[name as keyof typeof MaterialIcon.glyphMap];

  return type === "materialCommunity" && iconExists ? (
    <MaterialIcon
      name={name}
      style={[styles.icon, style]}
      color={color}
      size={size}
      onPress={onPress}
    />
  ) : SvgIcon ? (
    <SvgIcon
      width={size}
      height={size}
      fill={color}
      style={[styles.icon, style]}
      onPress={onPress}
    />
  ) : null;
};

export default React.memo(Icon);

const styles = StyleSheet.create({
  icon: {},
});
