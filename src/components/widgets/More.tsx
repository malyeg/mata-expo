import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { BaseViewProps } from "@/types/ReactTypes";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Icon, Text } from "../core";

interface MoreProps extends BaseViewProps {
  onPress: () => void;
}
const More = ({ style, onPress }: MoreProps) => {
  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <Text>More</Text>
      <Icon name="chevron-down" color={theme.colors.salmon} />
    </Pressable>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    ...sharedStyles.shadowBox,
    flexDirection: "row",
    padding: 10,
    width: 100,
    justifyContent: "space-between",
  },
});
