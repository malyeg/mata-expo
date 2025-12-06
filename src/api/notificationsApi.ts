import { serverTimestamp } from "@react-native-firebase/firestore";
import { Entity } from "../types/DataTypes";
import { DatabaseApi } from "./DatabaseApi";

export interface Notification extends Entity {
  id: string;
  title: string;
  body: string;
  userId: string;
  targetUserId: string;
  timestamp: Date;
  delivered: boolean;
  deliveredAt: Date;
  type: "push" | "email" | "chat";
  data: {
    id: string;
    eventType: "CLOSE_OFFER";
    url: string;
  };
}

class NotificationsApi extends DatabaseApi<Notification> {
  constructor() {
    super("notifications");
  }

  updateDelivery = (id: string) => {
    const deliveredAt = serverTimestamp();
    this.update(id, {
      delivered: true,
      deliveredAt,
    });
  };
}

const notificationsApi = new NotificationsApi();

export default notificationsApi;
