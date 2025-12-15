import { DatabaseApi } from "./DatabaseApi";

export interface Activity {
  online: boolean;
  lastActivity: number;
}

class ActivitiesApi extends DatabaseApi<Activity> {
  constructor() {
    super("activities");
  }

  connect = (userId: string) => {
    if (userId) {
      this.set(userId, {
        online: true,
        lastActivity: Date.now(),
      });
    }
  };

  disconnect = (userId: string) => {
    if (userId) {
      this.set(userId, {
        online: false,
        lastActivity: Date.now(),
      });
    }
  };
}

const activitiesApi = new ActivitiesApi();

export default activitiesApi;
