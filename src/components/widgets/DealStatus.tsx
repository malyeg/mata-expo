import { Deal } from "@/api/dealsApi";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "../core";

interface DealStatusProps {
  deal: Deal;
  style?: StyleProp<TextStyle>;
}
const DealStatus = ({ deal, style }: DealStatusProps) => {
  return (
    <Text
      style={[
        styles.statusText,
        deal.status === "accepted" ? sharedStyles.greenBtn : {},
        deal.status === "new" ? { backgroundColor: theme.colors.orange } : {},
        deal.status === "closed" ? { backgroundColor: theme.colors.dark } : {},
        style,
      ]}
    >
      {deal.status === "accepted" ? "Started" : deal.status}
    </Text>
  );
};

export default React.memo(DealStatus);

const styles = StyleSheet.create({
  statusText: {
    // position: 'absolute',
    backgroundColor: theme.colors.salmon,
    color: theme.colors.white,
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    zIndex: 1,
    textTransform: "capitalize",
  },
  greenBtn: {
    backgroundColor: theme.colors.green,
  },
});
