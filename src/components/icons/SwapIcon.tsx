import theme from "@/styles/theme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Icon } from "../core";

// const swapIconSize = 20;
// const swapIconPadding = 5;

interface SwapIconProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
}
const SwapIcon = ({ size = 20, style, iconStyle }: SwapIconProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          padding: size / 3,
          borderRadius: size / 2 + size / 3,
        },
        style,
      ]}
    >
      <Icon
        name="swap"
        type="custom"
        size={size}
        color={theme.colors.white}
        style={[styles.swapIcon, iconStyle]}
      />
    </View>
  );
};

export default React.memo(SwapIcon);

const styles = StyleSheet.create({
  container: {
    // backgroundColor: theme.colors.salmon,
    // padding: swapIconPadding,
    // borderRadius: swapIconSize / 2 + swapIconPadding,
    // marginHorizontal: -7,
    // zIndex: 1000,
  },
  swapIcon: {
    // margin: 5,
    borderWidth: 0,
  },
});
