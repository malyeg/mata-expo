import { LoggerFactory } from "@/utils/logger";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { create } from "zustand";

const logger = LoggerFactory.getLogger("NotificationStore");

interface NotificationState {
  pushToken?: string;
  unReadNotificationsCount: number;
  notificationsCount: number; // Total count of all notifications
  lastNotification?: Notifications.Notification;
  lastResponse?: Notifications.NotificationResponse;
  notificationError?: string | null;
  isInitialized: boolean;

  // Actions
  setPushToken: (token: string | undefined) => void;
  setUnReadNotificationsCount: (count: number) => void;
  setNotificationsCount: (count: number) => void;
  incrementUnReadNotificationsCount: () => void;
  decrementUnReadNotificationsCount: () => void;
  incrementNotificationsCount: () => void;
  setLastNotification: (
    notification: Notifications.Notification | undefined
  ) => void;
  setLastResponse: (
    response: Notifications.NotificationResponse | undefined
  ) => void;
  setNotificationError: (error: string | null) => void;
  clearLastNotification: () => void;
  clearLastResponse: () => void;

  registerForPushNotifications: () => Promise<void>;
  initialize: () => Promise<void>;
  reset: () => void;
}

interface RegistrationResult {
  token?: string;
  error?: string;
}

async function registerForPushNotificationsAsync(): Promise<RegistrationResult> {
  if (!Device.isDevice) {
    if (__DEV__) {
      return { token: "simulator" };
    }
    const errorMsg = "Must use a physical device for push notifications";
    logger.warn(errorMsg);
    return { error: errorMsg };
  }

  try {
    // 1) Permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      const errorMsg = "Push notification permission not granted";
      logger.warn(errorMsg);
      return { error: errorMsg };
    }

    // 2) Android channel setup
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // 3) Get Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      const errorMsg =
        "Expo project ID not found. Push token registration requires a projectId.";
      logger.error(errorMsg);
      return { error: errorMsg };
    }
    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return { token: tokenResponse.data };
  } catch (e: unknown) {
    const errorMsg =
      e instanceof Error
        ? e.message
        : "Failed to get push token due to an unknown error.";
    logger.error("Failed to get push token:", errorMsg, e);
    return { error: errorMsg };
  }
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  pushToken: undefined,
  unReadNotificationsCount: 0,
  notificationsCount: 0,
  lastNotification: undefined,
  lastResponse: undefined,
  notificationError: null,
  isInitialized: false,

  setPushToken: (token) => set({ pushToken: token }),

  setUnReadNotificationsCount: (count) =>
    set({ unReadNotificationsCount: count }),

  setNotificationsCount: (count) => set({ notificationsCount: count }),

  incrementUnReadNotificationsCount: () =>
    set((state) => ({
      unReadNotificationsCount: state.unReadNotificationsCount + 1,
    })),

  decrementUnReadNotificationsCount: () => {
    set((state) => ({
      unReadNotificationsCount: Math.max(state.unReadNotificationsCount - 1, 0),
    }));
  },

  incrementNotificationsCount: () =>
    set((state) => ({
      notificationsCount: state.notificationsCount + 1,
    })),

  setLastNotification: (notification) =>
    set({ lastNotification: notification }),

  setLastResponse: (response) => set({ lastResponse: response }),

  setNotificationError: (error) => set({ notificationError: error }),

  clearLastNotification: () => set({ lastNotification: undefined }),

  clearLastResponse: () => set({ lastResponse: undefined }),

  registerForPushNotifications: async () => {
    logger.debug("Registering for push notifications...");

    try {
      const result = await registerForPushNotificationsAsync();
      if (result.token) {
        logger.debug("Obtained push token:", result.token);
        set({
          pushToken: result.token,
          notificationError: null,
        });
      } else if (result.error) {
        logger.error("Token registration error:", result.error);
        set({
          notificationError: result.error,
          pushToken: undefined,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during token registration.";
      logger.error("Token registration error:", errorMessage, err);
      set({
        notificationError: errorMessage,
        pushToken: undefined,
      });
    }
  },

  initialize: async () => {
    const { isInitialized } = get();
    if (isInitialized) return;

    logger.debug("Initializing notification store...");

    // Register for push notifications
    await get().registerForPushNotifications();

    set({ isInitialized: true });
  },

  reset: () =>
    set({
      pushToken: undefined,
      unReadNotificationsCount: 0,
      notificationsCount: 0,
      lastNotification: undefined,
      lastResponse: undefined,
      notificationError: null,
      isInitialized: false,
    }),
}));
