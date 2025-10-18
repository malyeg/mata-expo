import { Item } from "@/api/itemsApi";
import theme from "@/styles/theme";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface ItemActivityProps {
  item: Item;
  style: ViewStyle;
}
const ItemActivity = ({ item, style }: ItemActivityProps) => {
  const styleList = [
    styles.container,
    style,
    item!.status === "online" ? styles.onlineBackgroundColor : {},
  ];
  return (
    <View style={styleList}>
      <Text style={[styles.activityStatusText]}>{item!.status}</Text>
    </View>
  );
};

export default React.memo(ItemActivity);

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 25,
    borderRadius: 11.5,
    backgroundColor: theme.colors.dark,
    justifyContent: "center",
    alignItems: "center",
  },
  activityStatusText: {
    color: theme.colors.white,
    ...theme.styles.scale.body3,
  },
  onlineBackgroundColor: {
    backgroundColor: theme.colors.green,
  },
});
