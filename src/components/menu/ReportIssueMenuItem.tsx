import { StyleSheet, View } from "react-native";
import React from "react";
import AppMenuItem from "./AppMenuItem";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/components/theme";
import { useRouter } from "expo-router";
import type { Order } from "@/models/order.model";

type ReportIssueMenuItemProps = {
  order: Order;
};

const ReportIssueMenuItem = ({ order, ...props }: ReportIssueMenuItemProps) => {
  const router = useRouter();

  const reportIssue = () => {
    router.navigate({
      pathname: "/support/contact",
      params: { orderId: order?.id, subject: "Order issue" }
    });
    // setVisible(false);
  };
  return (
    <AppMenuItem
      {...props}
      title={i18n.t("common.appMenu.reportIssueLabel")}
      onPress={reportIssue}
      icon={() => (
        <View
          style={{
            backgroundColor: theme.colors.error,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            width: 30,
            height: 30
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={theme.colors.light}
          />
        </View>
      )}
    />
  );
};

export default ReportIssueMenuItem;

const styles = StyleSheet.create({});
