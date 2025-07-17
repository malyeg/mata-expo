import { Item } from "@/api/itemsApi";
import React from "react";
import { Pressable, PressableProps, ViewStyle } from "react-native";
import SwapIcon from "./SwapIcon";

interface SwapbuttonProps extends PressableProps {
  item: Item;
  onPress?: () => void;
  iconSize?: number;
  iconStyle?: ViewStyle;
}
const SwapButton = ({
  item,
  onPress,
  hitSlop = 15,
  iconSize,
  iconStyle,
  ...props
}: SwapbuttonProps) => {
  return (
    <Pressable onPress={onPress} hitSlop={hitSlop} {...props}>
      <SwapIcon item={item} iconSize={iconSize} style={iconStyle} />
    </Pressable>
  );
};

export default React.memo(SwapButton);
