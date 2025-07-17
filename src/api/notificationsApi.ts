import {Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';
import firestore from '@react-native-firebase/firestore';

export interface Notification extends Entity {
  id: string;
  title: string;
  body: string;
  userId: string;
  targetUserId: string;
  timestamp: Date;
  delivered: boolean;
  deliveredAt: Date;
  type: 'push' | 'email' | 'chat';
  data: {
    id: string;
    eventType: 'CLOSE_OFFER';
    url: string;
  };
}

class NotificationsApi extends DataApi<Notification> {
  constructor() {
    super('notifications');
  }

  updateDelivery = (id: string) => {
    const deliveredAt = firestore.FieldValue.serverTimestamp();
    this.update(id, {
      delivered: true,
      deliveredAt,
    });
  };
}

const notificationsApi = new NotificationsApi();

export default notificationsApi;
