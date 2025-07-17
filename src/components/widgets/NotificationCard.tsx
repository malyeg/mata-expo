import notificationsApi, { Notification } from "@/api/notificationsApi";
import { patterns } from "@/config/constants";
import useNavigationHelper from "@/hooks/useNavigationHelper";
import theme from "@/styles/theme";
import { format } from "date-fns";
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
const NotificationCard = ({ notification, style }: NotificationCardProps) => {
  const { linkTo } = useNavigationHelper();
  const onPress = () => {
    notificationsApi.updateDelivery(notification?.id);
    if (notification.data?.url) {
      linkTo(notification.data.url);
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
        {!!notification.timestamp && (
          <Text style={styles.date}>
            {format(notification.timestamp, patterns.DATE_TIME)}
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
