import { useRouter } from "expo-router";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../components/core";
import Icon from "../components/core/Icon";
import PressableOpacity from "../components/core/PressableOpacity";
import theme from "../styles/theme";

interface DrawerItemProps {
  // navigation: DrawerNavigationHelpers;
  label: string;
  onPress?: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  badge?: number;
  to?: string;
}
const DrawerItem = ({
  // navigation,
  label,
  icon,
  style,
  iconStyle,
  labelStyle,
  onPress,
  to,
  badge,
}: DrawerItemProps) => {
  const router = useRouter();
  const navTo = () => {
    !!to && router.navigate(to as any);
    !!onPress && onPress();
  };
  return (
    <PressableOpacity onPress={navTo} style={[styles.container, style]}>
      {icon ? (
        <Icon
          name={icon}
          size={20}
          color={theme.colors.dark}
          style={[styles.icon, styles.emptyIcon, iconStyle]}
        />
      ) : (
        <View style={styles.emptyIcon} />
      )}
      <Text style={[styles.itemText, labelStyle]}>{label}</Text>
      {!!badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </PressableOpacity>
  );
};

export default React.memo(DrawerItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: 10,
    marginHorizontal: 20,
    borderBottomColor: theme.colors.lightGrey,
    borderBottomWidth: 2,
    height: 50,
  },
  icon: {
    // backgroundColor: 'grey',
  },
  emptyIcon: {
    marginRight: 30,
  },
  itemText: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
  },
  badge: {
    // position: 'absolute',
    // top: -5,
    // right: 5,
    marginLeft: 10,
    marginBottom: 10,
    width: 20,
    height: 20,
    backgroundColor: theme.colors.salmon,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    ...theme.styles.scale.body4,
    color: theme.colors.white,
  },
});
