import theme from "@/styles/theme";
import React, { FC, useCallback } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import Icon from "../core/Icon";
import Text from "../core/Text";
interface CheckBoxProps {
  size?: number;
  boxType?: "square" | "circle";
  value?: boolean | undefined;
  label?: string;
  onChange?: (v: boolean) => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  hitSlop?: number;
}
const CheckBox: FC<CheckBoxProps> = ({
  size = 22,
  boxType = "square",
  label,
  value = false,
  onChange,
  labelStyle,
  hitSlop,
  style,
}) => {
  const selectedIcon =
    boxType === "square" ? "checkbox-marked" : "checkbox-marked-circle";
  const emptyIcon =
    boxType === "square"
      ? "checkbox-blank-outline"
      : "checkbox-blank-circle-outline";

  const onToggle = useCallback(() => {
    !!onChange && onChange(!value);
  }, [onChange, value]);

  return (
    <Pressable
      hitSlop={hitSlop}
      onPress={onToggle}
      style={[styles.container, styles.checkBoxContainer, style]}
    >
      <Icon
        name={value ? selectedIcon : emptyIcon}
        size={size}
        style={[value === true ? styles.selected : styles.unselected]}
      />
      {label && (
        <Text body1 style={[styles.text, labelStyle]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  unselected: {
    color: theme.colors.grey,
  },
  selected: {
    color: theme.colors.green,
  },
  text: {
    paddingLeft: 10,
  },
  error: {
    color: theme.colors.salmon,
  },
});

export default React.memo(CheckBox);
