import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Icon, Text } from "../core";

interface NoDataFoundProps extends ViewProps {
  horizontal?: boolean;
  title?: string;
  body?: string;
  icon?: string;
  children?: React.ReactNode;
}
const NoDataFound = ({
  title,
  body,
  icon = "magnify",
  style,
  children,
}: NoDataFoundProps) => {
  const { t } = useLocale("common");
  return (
    <View style={[styles.container, style]}>
      {icon !== "" && (
        <Icon
          style={styles.icon}
          name={icon}
          color={theme.colors.salmon}
          size={70}
        />
      )}
      {title !== "" && (
        <Text h5 style={styles.title}>
          {title ?? t("noData.title")}
        </Text>
      )}
      {children ?? (
        <Text h6 style={styles.subTitle} numberOfLines={2}>
          {body ?? t("noData.subTitle")}
        </Text>
      )}
    </View>
  );
};

export default React.memo(NoDataFound);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: theme.colors.green,
  },
  subTitle: {
    alignItems: "center",
    textAlign: "center",
  },
  icon: {},
});
