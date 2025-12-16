import notificationsApi, { Notification } from "@/api/notificationsApi";
import { patterns } from "@/config/constants";
import theme from "@/styles/theme";
import { formatDate } from "@/utils/DateUtils";
import { useRouter } from "expo-router";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "../core";
import Card from "../core/Card";

interface NotificationCardProps {
  notification: Notification;
  style?: StyleProp<ViewStyle>;
}
const icons = {
  push: {
    name: "bell-outline",
  },
  email: {
    name: "email-outline",
  },
  chat: {
    name: "chat-outline",
  },
};

const notificationUrlToRoute = (url: string) => {
  const route = url.replace("mataapp://", "/");
  return route;
};
const NotificationCard = ({ notification, style }: NotificationCardProps) => {
  const router = useRouter();
  const notificationDate = notification.timestamp;
  const onPress = () => {
    notificationsApi.updateDelivery(notification?.id);
    if (notification.data?.url) {
      router.navigate(notificationUrlToRoute(notification.data.url) as any);
    }
  };
  const icon = icons[notification.type] ? icons[notification.type] : icons.push;
  return (
    <Card style={[styles.card, style]} onPress={onPress} icon={icon}>
      <View style={styles.container}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        {!!notificationDate && (
          <Text style={styles.date}>
            {formatDate(notificationDate, patterns.DATE)}
          </Text>
        )}
      </View>
    </Card>
  );
};

export default React.memo(NotificationCard);

const styles = StyleSheet.create({
  card: {
    marginRight: 2,
  },
  container: {
    flex: 1,
    // backgroundColor: 'grey',
  },
  date: {
    ...theme.styles.scale.body2,
    color: theme.colors.grey,
  },
  title: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
  },
  body: {
    flexWrap: "wrap",
    marginRight: 25,
    ...theme.styles.scale.body2,
  },
});
