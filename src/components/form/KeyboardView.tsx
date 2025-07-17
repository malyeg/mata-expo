import useKeyboard from "@/hooks/useKeyboard";
import React from "react";
import { View, ViewProps } from "react-native";

interface KeyboardViewProps extends ViewProps {
  children: React.ReactNode;
}
const KeyboardView = ({ ...props }: KeyboardViewProps) => {
  const { keyboardShown } = useKeyboard();

  return !keyboardShown ? <View {...props}>{props.children}</View> : null;
};

export default React.memo(KeyboardView);
