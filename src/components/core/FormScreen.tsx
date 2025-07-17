import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import useKeyboard from "@/hooks/useKeyboard";
import Screen, { ScreenProps } from "./Screen";

interface PressableScreenProps extends ScreenProps {
  dismissKeyboard?: boolean;
  onPress?: () => void;
}
const FormScreen = ({
  dismissKeyboard = true,
  onPress,
  children,
  style,
  scrollable = true,
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
    <KeyboardAvoidingView
      style={styles.fullScreen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        style={styles.fullScreen}
        scrollable={scrollable}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        <Pressable onPress={onPressHandler} style={[styles.fullScreen, style]}>
          {children}
        </Pressable>
      </Screen>
    </KeyboardAvoidingView>
  );
};

export default React.memo(FormScreen);

const styles = StyleSheet.create({
  fullScreen: {
    flexGrow: 1,
  },
});
