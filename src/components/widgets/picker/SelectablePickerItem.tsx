import { CheckBox, Text } from "@/components/core";
import React, { useCallback } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

// export type PickerItem = {value: string; label?: string};

type SelectablePickerItemProps = {
  item: any;
  label: string;
  selected?: boolean;
  onChange: (item: any, selected: boolean) => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};
const SelectablePickerItem = ({
  label,
  item,
  onChange,
  selected,
  style,
  labelStyle,
}: SelectablePickerItemProps) => {
  const onItemChange = useCallback(() => {
    if (onChange) {
      onChange(item, !selected);
    }
  }, [onChange, selected, item]);

  return (
    <Pressable onPress={onItemChange} style={[styles.container, style]}>
      <CheckBox
        value={selected}
        onChange={onItemChange}
        style={styles.checkbox}
      />
      <Text body1 style={[styles.text, labelStyle]} adjustsFontSizeToFit={true}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 61,
  },
  text: {
    flex: 1,
    // paddingHorizontal: 10,
    textAlignVertical: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
});

export default React.memo(SelectablePickerItem);
