import notificationsApi, { Notification } from "@/api/notificationsApi";
import useAuth from "@/hooks/useAuth";
import { QueryBuilder } from "@/types/DataTypes";
import React, { useEffect, useState } from "react";
import Badge from "../core/Badge";

const NotificationBadge = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    const query = new QueryBuilder<Notification>()
      .filters([
        { field: "delivered", value: false },
        { field: "targetUserId", value: user.id },
      ])
      .build();
    const unsubscribe = notificationsApi.onQuerySnapshot(
      (snapshot) => {
        console.log("NotificationBadge onQuerySnapshot");
        setNotificationCount(snapshot.data.length);
      },
      (error) => console.warn("drawerContent onQuerySnapshot error", error),
      query
    );
    return unsubscribe;
  }, [user.id]);

  return <Badge count={notificationCount} />;
};

export default NotificationBadge;
