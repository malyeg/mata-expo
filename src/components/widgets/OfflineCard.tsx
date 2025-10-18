import useConnectionCheck from "@/hooks/useConnectionCheck";
import useLocale from "@/hooks/useLocale";
import useLocation from "@/hooks/useLocation";
import React from "react";
import { StyleSheet, View } from "react-native";
import theme from "../../styles/theme";
import { Icon, Text } from "../core";

const OfflineCard = () => {
  const { isInternetReachable } = useConnectionCheck();
  const { connected, isInitializing } = useLocation();
  const { t } = useLocale("widgets");

  if (isInitializing) {
    return null; // or a loading indicator
  }
  return !isInternetReachable ? (
    <OfflineComponent
      title={t("offlineCard.title")}
      body={t("offlineCard.body")}
    />
  ) : !connected ? (
    <OfflineComponent
      title={t("offlineCard.title")}
      body={t("offlineCard.locationBody")}
    />
  ) : null;
};

const OfflineComponent = ({ title, body }: { title: string; body: string }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Icon name="wifi-off" size={30} color={theme.colors.white} />
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.contentContainer}>
      <Text numberOfLines={2} style={styles.body}>
        {body}
      </Text>
    </View>
  </View>
);
export default OfflineCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: theme.colors.error,
    padding: 5,
    paddingVertical: 10,
    borderRadius: 5,
  },
  contentContainer: {
    // flexWrap: 'nowrap',
  },
  header: {
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    alignSelf: "flex-start",
  },
  title: {
    ...theme.styles.scale.h6,
    color: theme.colors.white,
  },
  body: {
    ...theme.styles.scale.body2,
    color: theme.colors.white,
  },
});
