import theme from "@/styles/theme";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface BadgeProps {
  count: number;
  style?: StyleProp<ViewStyle>;
  type?: "notification" | "counter";
}
const Badge = ({ count, style, type = "counter" }: BadgeProps) => {
  return count && count > 0 ? (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{type === "counter" ? count : "N"}</Text>
    </View>
  ) : null;
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
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
