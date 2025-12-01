import { SvgIcons } from "@/assets/svgs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { I18nManager, StyleProp, StyleSheet, TextStyle } from "react-native";

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
    !!MaterialCommunityIcons.glyphMap[
      name as keyof typeof MaterialCommunityIcons.glyphMap
    ];

  return type === "materialCommunity" && iconExists ? (
    <MaterialCommunityIcons
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

export const ChevronLeftIcon = (props: Omit<IconProps, "name">) => (
  <MaterialCommunityIcons name="chevron-left" {...props} />
);

export const ChevronRightIcon = (props: Omit<IconProps, "name">) => (
  <MaterialCommunityIcons name="chevron-right" {...props} />
);

export const ShareIcon = (props: Omit<IconProps, "name">) => (
  <MaterialCommunityIcons name="share-variant" {...props} />
);

export const ComplainIcon = (props: Omit<IconProps, "name">) => (
  <MaterialCommunityIcons name="alert-circle-outline" {...props} />
);

/**
 * RTL-aware chevron icon that points in the "forward" direction
 * - LTR (English): chevron-right
 * - RTL (Arabic): chevron-left
 */
export const ChevronIcon = (props: Omit<IconProps, "name">) => (
  <MaterialCommunityIcons
    name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
    {...props}
  />
);

/**
 * RTL-aware back chevron icon that points in the "back" direction
 * - LTR (English): chevron-left
 * - RTL (Arabic): chevron-right
 */
export const ChevronBackIcon = (props: Omit<IconProps, "name">) => (
  <MaterialCommunityIcons
    name={I18nManager.isRTL ? "chevron-right" : "chevron-left"}
    {...props}
  />
);

export const MenuIcon = (props: Omit<IconProps, "name">) => (
  <MaterialCommunityIcons name="menu" {...props} />
);

export default React.memo(Icon);

const styles = StyleSheet.create({
  icon: {},
});
