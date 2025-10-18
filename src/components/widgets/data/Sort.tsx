import { Text } from "@/components/core";
import Icon from "@/components/core/Icon";
import theme from "@/styles/theme";
import { SortDirection } from "@/types/DataTypes";
import React, { useCallback, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface SortIconProps {
  onChange: (value: SortDirection) => void;
  style?: StyleProp<ViewStyle>;
}

const Sort = ({ onChange, style }: SortIconProps) => {
  const [state, setState] = useState<SortDirection>();
  const onChangeState = useCallback(() => {
    setState((s) => {
      let newState: SortDirection;
      if (s === "asc") {
        newState = "desc";
      } else if (s === "desc") {
        newState = undefined;
      } else {
        newState = "asc";
      }
      if (onChange) {
        onChange(newState);
      }
      return newState;
    });
  }, [onChange]);
  const iconName =
    state === "asc"
      ? "sort-ascending"
      : state === "desc"
      ? "sort-descending"
      : "sort";
  return (
    <View style={[styles.container, style]}>
      <Text>Sort</Text>
      <Icon
        name={iconName}
        onPress={onChangeState}
        size={30}
        color={theme.colors.dark}
      />
    </View>
  );
};

export default React.memo(Sort);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
