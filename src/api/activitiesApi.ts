import { Config } from "@/utils/Config";
import firestore from "@react-native-firebase/firestore";
import { DataCollection } from "../types/DataTypes";

export interface Activity {
  online: boolean;
  lastActivity: number;
}

class ActivitiesApi {
  collection: DataCollection<Activity>;
  constructor() {
    this.collection = firestore().collection<Activity>(
      Config.SCHEMA_PREFIX + "activities"
    );
  }

  connect = (userId: string) => {
    this.collection.doc(userId).set({
      online: true,
      lastActivity: Date.now(),
    });
  };

  disconnect = (userId: string) => {
    if (userId) {
      this.collection.doc(userId).set({
        online: false,
        lastActivity: Date.now(),
      });
    }
  };
}

const activitiesApi = new ActivitiesApi();

export default activitiesApi;
