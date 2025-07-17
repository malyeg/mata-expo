import sharedStyles from "@/styles/SharedStyles";
import theme, { ColorProps } from "@/styles/theme";
import React, { useCallback } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import Icon, { IconProps } from "./Icon";
import PressableOpacity, { PressableOpacityProps } from "./PressableOpacity";
import Text from "./Text";

// interface AppButtonProps extends ButtonProps {}

export interface ButtonProps extends ColorProps, PressableOpacityProps {
  title: string;
  icon?: IconProps;
  themeType?: "primary" | "secondary" | "dark" | "white";
  metaData?: { [key: string]: unknown };
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  type?: "button" | "link";
}

const AppButton = ({
  disabled,
  themeType = "primary",
  textStyle,
  iconStyle,
  icon,
  type = "button",
  onPress,
  ...props
}: ButtonProps) => {
  const title = props.title ?? props.children;

  const onPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      if (onPress && !disabled) {
        onPress(event);
      }
    },
    [disabled, onPress]
  );

  const themeStyle = styles[themeType] ?? {};
  const themeTextStyle =
    themeType === "white" ? styles.darkText : styles.whiteText;

  const styleList = [
    styles.container,
    themeStyle ? themeStyle : {},
    props.style as StyleProp<ViewStyle>,
  ];
  const styleTextList = [styles.text, themeTextStyle, textStyle];

  const styleLinkText = [sharedStyles.linkText, sharedStyles.link, textStyle];
  return (
    <PressableOpacity
      {...props}
      onPress={onPressHandler}
      disabled={disabled}
      style={type === "link" ? props.style : styleList}
    >
      {icon && <Icon style={[styles.icon, iconStyle]} {...icon} />}
      <Text button style={type === "link" ? styleLinkText : styleTextList}>
        {title}
      </Text>
    </PressableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.salmon,
    // width: '100%',
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 66,
  },
  text: {
    color: theme.colors.white,
  },
  dark: {
    backgroundColor: theme.colors.dark,
  },
  primary: {
    backgroundColor: theme.colors.salmon,
  },
  secondary: {
    backgroundColor: theme.colors.dark,
  },
  white: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
  },
  darkText: {
    color: theme.colors.dark,
  },
  whiteText: {
    color: theme.colors.white,
  },
  icon: {
    position: "absolute",
    left: 30,
  },
});

export default React.memo(AppButton);
