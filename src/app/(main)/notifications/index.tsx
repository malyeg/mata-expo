import notificationsApi, { Notification } from "@/api/notificationsApi";
import { Icon, Loader, Screen, Text } from "@/components/core";
import NotificationCard from "@/components/widgets/NotificationCard";
import { screens } from "@/config/constants";
import { useFirestoreQuery } from "@/hooks/db/useFirestoreQuery";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const NotificationsScreen = () => {
  const { user } = useAuth();
  const { t } = useLocale(screens.NOTIFICATIONS);

  const { data, loading } = useFirestoreQuery<Notification>(
    notificationsApi.collectionName,
    (ref) => {
      return ref
        .where("delivered", "==", false)
        .where("targetUserId", "==", user?.id)
        .orderBy("timestamp", "desc");
    }
  );

  const renderItem = ({ item }: any) => (
    <NotificationCard notification={item} style={styles.card} />
  );
  const noDataFound = useCallback(
    () => (
      <View style={styles.noDataContainer}>
        <Icon name="bell-off-outline" color={theme.colors.grey} size={70} />
        <Text style={styles.okText}>{t("noNotificationsText")}</Text>
      </View>
    ),
    [t]
  );

  return (
    <Screen style={styles.screen}>
      {!loading ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          ListEmptyComponent={noDataFound}
          contentContainerStyle={
            data && data.length > 0 ? undefined : styles.listContentContainer
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Loader />
      )}
    </Screen>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    // flex: 1,
    marginTop: 100,
  },
  okText: {
    fontSize: 30,
    color: theme.colors.salmon,
    marginTop: 20,
    // backgroundColor: 'grey',
  },
  okTitle: {
    fontSize: 30,
    marginBottom: 20,
  },
});
