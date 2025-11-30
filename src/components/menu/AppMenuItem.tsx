import { theme } from "@/styles/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "../core";
import { ChevronIcon } from "../core/Icon";
import PressableOpacity from "../core/PressableOpacity";

export type AppMenuItemProps = {
  onPress: () => void;
  title: string;
  icon?: any;
  closeMenu?: () => void;
};

const AppMenuItem = ({ onPress, title, icon, closeMenu }: AppMenuItemProps) => {
  const handleOnPress = () => {
    onPress();
    closeMenu?.();
  };

  return (
    <PressableOpacity onPress={handleOnPress} style={styles.container}>
      {icon?.()}
      <Text>{title}</Text>
      <ChevronIcon
        size={30}
        color={theme.colors.grey}
        style={{ marginLeft: "auto" }}
      />
    </PressableOpacity>
  );
};

export default AppMenuItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
});
