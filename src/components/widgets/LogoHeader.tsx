import theme from "@/styles/theme";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "../core";
import Logo from "../core/Logo";

const LogoHeader = () => {
  const navigation = useNavigation();
  const toggleDrawer = () => {
    (navigation as any).toggleDrawer();
  };
  return (
    <View style={styles.container}>
      <Icon
        name="menu"
        size={30}
        color={theme.colors.dark}
        onPress={toggleDrawer}
        style={styles.menuIcon}
      />
      <Logo size={75} style={styles.logo} />
    </View>
  );
};

export default React.memo(LogoHeader);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.defaults.SCREEN_PADDING,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 60,
  },
  menuIcon: {
    position: "absolute",
    left: 0,
  },
});
