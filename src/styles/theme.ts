import { PressableOpacityProps } from "@/components/core/PressableOpacity";
import { AtLeastOne } from "@/types/UtilityTypes";
import React from "react";
import { TextProps, TextStyle } from "react-native";

// Definitions
export const Scales = {
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  h7: {},
  subtitle1: {},
  subtitle2: {},
  body1: {},
  body2: {},
  body3: {},
  button: {},
  caption: {},
  overline: {},
};

const colors = {
  primary: "#727272",
  secondary: "#83D2C8",
  dark: "#727272",
  white: "white",
  yellow: "yellow",
  grey: "#b2b2b2",
  lightGrey: "#f3f3f4",
  salmon: "#EC6565",
  rose: "#ffe7e5",
  pink: "#EBCECC",
  warn: "#FFFED1",
  green: "#83D2C8",
  lightGreen: "#65d434",
  orange: "#ff7e00",
  error: "#CC3333",
  pictonBlue: "#30c6e0",
  lightPictonBlue: "#b6f0fa",
};

// // type ColorKeys = keyof typeof Color;
// type ColorFields = {[key in keyof typeof Colors]: string};

// interface Colors extends ColorFields {}

export type ColorStyle = { color: TextStyle["color"] };
export type ButtonStyle = { backgroundColor: TextStyle["backgroundColor"] };
export type WeightStyle = { fontWeight: TextStyle["fontWeight"] };
export type FontStyle = { fontStyle: TextStyle["fontStyle"] };
export type FontWeight = {
  [key in keyof WeightStyles]: TextStyle["fontWeight"];
  // [key in keyof WeightStyles]: FontStyle;
};
interface WeightStyles {
  thin: WeightStyle;
  ultraLight: WeightStyle;
  light: WeightStyle;
  regular: WeightStyle;
  medium: WeightStyle;
  semiBold: WeightStyle;
  bold: WeightStyle;
  heavy: WeightStyle;
}

export type ETextProps = {
  textStyle?: TextStyle;
  scale?: keyof typeof Scales;
  maxSize?: number;
  children: React.ReactNode;
} & TextProps &
  AtLeastOne<ScaleProps>;
// Props
export type ScaleProps = Partial<{ [key in keyof typeof Scales]: boolean }>;
export type ColorProps = Partial<{ [key in keyof typeof colors]: boolean }>;
export type WeightProps = Partial<{ [key in keyof WeightStyles]: boolean }>;

export type LinkProps = ETextProps & PressableOpacityProps;

// THEME
type TextColor = { [key in keyof typeof colors]: ColorStyle };
type ButtonColor = { [key in keyof typeof colors]: ButtonStyle };

const fontWeight: FontWeight = {
  thin: "100",
  ultraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "bold",
  heavy: "800",
};

const defaults = {
  SCREEN_PADDING: 20,
};

// Font families for different locales
const fonts = {
  arabic: {
    regular: "Cairo_400Regular",
    medium: "Cairo_500Medium",
    semiBold: "Cairo_600SemiBold",
    bold: "Cairo_700Bold",
  },
  default: {
    regular: undefined, // Use system font
    medium: undefined,
    semiBold: undefined,
    bold: undefined,
  },
};

/**
 * Get the appropriate font family based on locale
 * @param locale - The current locale ('ar' | 'en')
 * @param weight - The font weight ('regular' | 'medium' | 'semiBold' | 'bold')
 */
export const getFontFamily = (
  locale: string,
  weight: keyof typeof fonts.arabic = "regular"
): string | undefined => {
  if (locale === "ar") {
    return fonts.arabic[weight];
  }
  return fonts.default[weight];
};

const theme = {
  colors,
  fontWeight,
  fonts,
  defaults,
  styles: {
    scale: {
      h1: { fontSize: 96 },
      h2: { fontSize: 60 },
      h3: { fontSize: 48 },
      h4: { fontSize: 34 },
      h5: { fontSize: 24 },
      h6: { fontSize: 20 },
      h7: { fontSize: 18 },
      subtitle1: { fontSize: 16 },
      subtitle2: { fontSize: 14 },
      body1: { fontSize: 16 },
      body2: { fontSize: 14 },
      body3: { fontSize: 12 },
      body4: { fontSize: 10 },
      button: { fontSize: 20, fontWeight: "bold" },
      caption: { fontSize: 12 },
      overline: { fontSize: 10 },
    },
    weight: {
      thin: { fontWeight: fontWeight.thin },
      ultraLight: { fontWeight: "200" },
      light: { fontWeight: "300" },
      regular: { fontWeight: "400" },
      medium: { fontWeight: "500" },
      semiBold: { fontWeight: "600" },
      bold: { fontWeight: "700" },
      heavy: { fontWeight: "800" },
    },
    inputBorder: {
      borderBottomColor: colors.grey,
      borderBottomWidth: 1,
    },
  },
};

// utilities

export const getScaleStyle = (scale: ETextProps["scale"]) => {
  return theme.styles.scale[scale!];
};

export const getScaleStyleFromProps = (props: Partial<ScaleProps>): any => {
  const scaleObj = theme.styles.scale;
  let style;
  Object.keys(props).forEach((key: string) => {
    if (scaleObj.hasOwnProperty(key)) {
      style = scaleObj[key as keyof typeof Scales];
    }
    // return theme.styles.scale[key!];
  });
  return style;
};

export default theme;
export { theme };
