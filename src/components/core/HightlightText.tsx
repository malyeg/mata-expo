import sharedStyles from "@/styles/SharedStyles";
import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

interface HightlightTextProps {
  text: string;
  textToHightlight: string;
  style?: StyleProp<TextStyle>;
  hightlightStyle?: StyleProp<TextStyle>;
  ignoreCase?: boolean;
  children?: ReactNode;
}
const HightlightText = ({
  text,
  textToHightlight,
  style,
  hightlightStyle,
  ignoreCase,
  children,
}: HightlightTextProps) => {
  let flags = "gm";
  if (ignoreCase) {
    flags = flags + "i";
  }
  const regex = new RegExp(`(${textToHightlight})`, flags);
  const parts = text.split(regex);
  return (
    <Text style={[sharedStyles.text, style]}>
      {parts.map((part, index) => {
        const matched = regex.test(part);
        return matched ? (
          <Text key={index} style={[styles.highlightedText, hightlightStyle]}>
            {part}
          </Text>
        ) : (
          part
        );
      })}
      {children}
    </Text>
  );
};

export default HightlightText;

const styles = StyleSheet.create({
  highlightedText: {
    fontWeight: "900",
  },
});
