import { Deal } from "@/api/dealsApi";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import React, { useMemo } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "../core";

interface DealStatusProps {
  deal: Deal;
  style?: StyleProp<TextStyle>;
}
const DealStatus = ({ deal, style }: DealStatusProps) => {
  const { t } = useLocale("widgets");

  const statusLabel = useMemo(() => {
    const status = deal.status.toLowerCase();
    switch (status) {
      case "accepted":
        return t("dealStatus.accepted");
      case "new":
        return t("dealStatus.new");
      case "closed":
        return t("dealStatus.closed");
      case "rejected":
        return t("dealStatus.rejected");
      case "cancelled":
        return t("dealStatus.cancelled");
      default:
        return deal.status;
    }
  }, [deal.status, t]);

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
      {statusLabel}
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
