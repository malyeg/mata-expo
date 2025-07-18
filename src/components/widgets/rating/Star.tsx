import { Icon } from "@/components/core";
import theme from "@/styles/theme";
import React, { useCallback } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface StarProps {
  index: number;
  onPress?: (index: number) => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: number;
}
const Star = ({ selected, onPress, index, style, size = 40 }: StarProps) => {
  const onSelect = useCallback(() => {
    if (onPress) {
      onPress(index);
    }
  }, [index, onPress]);
  return (
    <Pressable onPress={onSelect} style={[styles.container, style]}>
      <Icon
        name={selected ? "star" : "star-outline"}
        size={size}
        color={selected ? theme.colors.salmon : theme.colors.grey}
        style={styles.icon}
      />
    </Pressable>
  );
};

export default React.memo(Star);

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 20,
  },
  icon: {
    // color: theme.colors.grey,
  },
});
