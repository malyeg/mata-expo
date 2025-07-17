import { screens } from "@/config/constants";
import theme from "@/styles/theme";
import { useNavigation } from "@react-navigation/core";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";
import React, { FC } from "react";
import { StyleProp, StyleSheet, TextStyle, ViewProps } from "react-native";
import { Icon } from "../core";
import PressableOpacity from "../core/PressableOpacity";

interface ProfileIconProps extends ViewProps {
  size?: number;
  iconStyle?: StyleProp<TextStyle>;
}
const ProfileIcon: FC<ProfileIconProps> = ({ style, iconStyle, size = 25 }) => {
  const navigation = useNavigation<DrawerNavigationHelpers>();

  const navigate = () => navigation.navigate(screens.PROFILE);
  return (
    <PressableOpacity
      hitSlop={10}
      style={[styles.container, style]}
      onPress={navigate}
    >
      <Icon
        name="account-outline"
        size={size}
        style={[styles.profileIcon, iconStyle]}
        color={theme.colors.dark}
      />
    </PressableOpacity>
  );
};

export default React.memo(ProfileIcon);

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  profileIcon: {},
  separator: {
    height: 10,
  },
});
