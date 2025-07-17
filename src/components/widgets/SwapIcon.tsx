import { Item } from "@/api/itemsApi";
import theme from "@/styles/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Icon, Text } from "../core";

interface SwapIconProps extends ViewProps {
  item?: Item;
  onPress?: () => void;
  iconSize?: number;
}
const SwapIcon = ({ item, iconSize = 20, style }: SwapIconProps) => {
  return (
    <View style={[styles.container, style]}>
      <Icon
        name="swap"
        type="custom"
        size={iconSize}
        color={theme.colors.salmon}
      />
      {!!item && (
        <Text style={styles.offersText}>
          {item.offers ? item.offers.length : 0}
        </Text>
      )}
    </View>
  );
};

export default React.memo(SwapIcon);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 12,
    height: 25,
    paddingHorizontal: 7,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    // width: 50,
  },
  offersText: {
    ...theme.styles.scale.body2,
    paddingLeft: 5,
  },
});
