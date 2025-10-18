import sharedStyles from "@/styles/SharedStyles";
import {
  ETextProps,
  getScaleStyle,
  getScaleStyleFromProps,
} from "@/styles/theme";
import React from "react";
import { StyleSheet, Text } from "react-native";
// type AppTextProps = TextProps & OnlyOne<ScaleProps>;

const AppText = ({
  scale,
  style,
  maxSize,
  ...props
}: Omit<ETextProps, "textStyle">) => {
  const styleList = [
    sharedStyles.text,
    getScaleStyleFromProps(props),
    getScaleStyle(scale),
    style,
  ];
  const children =
    !maxSize || typeof props.children !== "string"
      ? props.children
      : props.children.length > maxSize
      ? props.children.substring(0, maxSize) + "..."
      : props.children;
  return (
    <Text {...props} style={styleList}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});

export default React.memo(AppText);
