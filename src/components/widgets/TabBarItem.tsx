import theme from "@/styles/theme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Icon from "../core/Icon";
import PressableOpacity from "../core/PressableOpacity";

export interface TabBarItemProps {
  to: { screen: string; params?: any };
  label?: string;
  icon?: string;
  iconStyle?: StyleProp<TextStyle>;
  badge?: number;
  style?: StyleProp<ViewStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  isFocused?: boolean;
  onPress?: (to: TabBarItemProps["to"]) => void;
}
const TabBarItem = ({
  to,
  label,
  icon,
  badge,
  iconStyle,
  badgeStyle,
  isFocused,
  onPress,
  ...props
}: TabBarItemProps) => {
  // const route: any = state.routes.find(() => route.name === name);

  const onPressHandler = () => {
    if (onPress) {
      onPress(to);
    }
  };
  return (
    <PressableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPressHandler}
      style={[styles.container, props.style as ViewStyle]}
    >
      {!!badge && (
        <View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>{badge >= 1000 ? "N" : badge}</Text>
        </View>
      )}
      {!!icon && (
        <Icon
          name={icon}
          color={isFocused ? theme.colors.green : theme.colors.dark}
          size={24}
          style={[styles.icon, iconStyle]}
        />
      )}
      {!!label && (
        <Text style={[styles.label, isFocused ? styles.labelFocused : {}]}>
          {label}
        </Text>
      )}
    </PressableOpacity>
  );
};

export default React.memo(TabBarItem);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: theme.colors.dark,
    ...theme.styles.scale.body4,
  },
  labelFocused: {
    color: theme.colors.dark,
  },
  icon: {
    fontWeight: "500",
  },
  iconFocused: {
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: 15,
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
