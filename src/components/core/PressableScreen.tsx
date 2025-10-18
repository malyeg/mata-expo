import useKeyboard from "@/hooks/useKeyboard";
import React from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import Screen, { ScreenProps } from "./Screen";

interface PressableScreenProps extends ScreenProps {
  dismissKeyboard?: boolean;
  onPress?: () => void;
}
const PressableScreen = ({
  dismissKeyboard = true,
  onPress,
  children,
  style,
  ...props
}: PressableScreenProps) => {
  const { keyboardShown } = useKeyboard();
  const onPressHandler = () => {
    if (dismissKeyboard && keyboardShown) {
      Keyboard.dismiss();
    }
    if (onPress) {
      onPress();
    }
  };
  return (
    <Pressable onPress={onPressHandler} style={styles.container}>
      <Screen style={[styles.screen, style]} {...props}>
        {children}
      </Screen>
    </Pressable>
  );
};

export default React.memo(PressableScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {},
});
