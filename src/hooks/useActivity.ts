import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import activitiesApi from "../api/activitiesApi";
import authApi from "../api/authApi";
import { LoggerFactory } from "../utils/logger";

const logger = LoggerFactory.getLogger("useActivity");
const ACTIVITY_INTERVAL = 10 * 60 * 1000;
const useActivity = () => {
  useEffect(() => {
    const userId = authApi?.getUser()?.uid!;

    const handleAppStateInactiveChange = async (state: AppStateStatus) => {
      logger.log("state", state);
      if (state === "background" || state === "inactive") {
        await activitiesApi.disconnect(userId);
      } else if (state === "active") {
        activitiesApi.connect(userId);
      }
    };

    const interval = setInterval(() => {
      activitiesApi.connect(userId);
    }, ACTIVITY_INTERVAL);
    // Assuming user is logged in
    const appStateSub = AppState.addEventListener(
      "change",
      handleAppStateInactiveChange
    );

    return () => {
      appStateSub.remove();
      !!interval && clearInterval(interval);
    };
  }, []);
  return {};
};

export default useActivity;
