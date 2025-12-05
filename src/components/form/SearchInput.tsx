import theme from "@/styles/theme";
import React, { FC, useCallback, useRef } from "react";
import {
  I18nManager,
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewProps,
} from "react-native";
import { Icon } from "../core";

interface SearchInputProps extends ViewProps {
  placeholder?: string;
  textStyle?: TextStyle;
  onChangeText?: ((text: string) => void) | undefined;
  value?: string;
  onPress?: () => void;
}
const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  textStyle,
  onChangeText,
  value,
  onPress,
  ...props
}) => {
  const inputRef = useRef<TextInput>(null);
  const viewStyles = [styles.container, props.style];
  const textInputStyles = [styles.text, textStyle];

  const resetInput = useCallback(() => {
    inputRef?.current?.clear();
    if (onChangeText) {
      onChangeText("");
    }
  }, [onChangeText]);
  return (
    <Pressable style={viewStyles} onPress={onPress}>
      <Icon
        style={styles.icon}
        name="magnify"
        color={theme.colors.grey}
        size={25}
      />
      <TextInput
        ref={inputRef}
        autoCapitalize="none"
        placeholder={placeholder}
        style={textInputStyles}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        placeholderTextColor={theme.colors.grey}
      />
      <Icon
        style={styles.resetIcon}
        name="close"
        color={theme.colors.grey}
        size={25}
        onPress={resetInput}
      />
    </Pressable>
  );
};

export default React.memo(SearchInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.lightGrey,
    alignItems: "center",
    borderRadius: 7,
    paddingHorizontal: 10,
    height: 45,
  },
  text: {
    flex: 1,
    ...theme.styles.scale.body1,
    textAlign: I18nManager.isRTL ? "right" : "left",
    color: theme.colors.dark,
    // backgroundColor: 'blue',
  },
  icon: {
    paddingRight: 5,
    // marginLeft: "auto",
  },
  resetIcon: {
    // marginRight: 1,
    marginStart: "auto",
  },
});
