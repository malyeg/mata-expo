import notificationsApi from "@/api/notificationsApi";
import useSheet from "@/hooks/useSheet";
import { useNotificationStore } from "@/store/notification-store";
import { LoggerFactory } from "@/utils/logger";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

const logger = LoggerFactory.getLogger("useNotificationListener");

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // We handle foreground notifications manually
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
});

interface NotificationData {
  url?: string;
  id?: string;
  eventType?: string;
}

/**
 * Hook to handle notification events:
 * - Foreground notifications (shown as an alert)
 * - Notification taps (navigates to URL)
 * - Initial notification (app launched from notification)
 */
const useNotificationListener = () => {
  console.log("=== useNotificationListener hook called ===");
  logger.debug("useNotificationListener hook called");
  const router = useRouter();
  const {
    setLastNotification,
    setLastResponse,
    incrementUnReadNotificationsCount,
    incrementNotificationsCount,
  } = useNotificationStore();

  const { show, sheetRef } = useSheet();

  const notificationListener = useRef<Notifications.Subscription>(undefined);
  const responseListener = useRef<Notifications.Subscription>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Navigate to a URL from notification data
   */
  const navigateToUrl = useCallback(
    (url: string) => {
      try {
        // Handle both full URLs and relative paths
        const route = url.includes("://")
          ? url.replace(/^[^:]+:\/\//, "/")
          : url.startsWith("/")
          ? url
          : `/${url}`;

        logger.debug("Navigating to:", route);
        router.push(route as any);
      } catch (error) {
        logger.error("Failed to navigate to notification URL:", error);
      }
    },
    [router]
  );

  /**
   * Track notification delivery
   */
  const trackDelivery = useCallback((notificationId: string) => {
    try {
      notificationsApi.updateDelivery(notificationId);
      logger.debug("Notification delivery tracked:", notificationId);
    } catch (error) {
      logger.error("Failed to track notification delivery:", error);
    }
  }, []);

  /**
   * Handle foreground notification - show a sheet to the user
   */
  const handleForegroundNotification = useCallback(
    (notification: Notifications.Notification) => {
      const { title, body, data } = notification.request.content;
      const notificationData = data as NotificationData;
      const isCloseOffer = notificationData?.eventType === "CLOSE_OFFER";

      logger.debug("Foreground notification received:", { title, body, data });

      // Update store
      setLastNotification(notification);
      incrementNotificationsCount();
      incrementUnReadNotificationsCount();

      // If there's a URL, show a sheet with option to navigate
      if (notificationData?.url) {
        show({
          header: title ?? "Notification",
          body: body ?? "",
          hideCancel: isCloseOffer,
          headerIcon: isCloseOffer
            ? { name: "check-circle-outline" }
            : undefined,
          confirmCallback: () => {
            if (notificationData.id) {
              trackDelivery(notificationData.id);
            }
            navigateToUrl(notificationData.url!);
          },
          confirmTitle: "Open",
        });
      }
    },
    [
      setLastNotification,
      incrementNotificationsCount,
      incrementUnReadNotificationsCount,
      trackDelivery,
      navigateToUrl,
      show,
    ]
  );

  /**
   * Handle notification response (user tapped on notification)
   */
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const { data } = response.notification.request.content;
      const notificationData = data as NotificationData;

      logger.debug("Notification tapped:", {
        data: notificationData,
        actionIdentifier: response.actionIdentifier,
      });

      // Update store
      setLastResponse(response);

      // Track delivery
      if (notificationData?.id) {
        trackDelivery(notificationData.id);
      }

      // Navigate to URL if present
      if (notificationData?.url) {
        navigateToUrl(notificationData.url);
      }
    },
    [setLastResponse, trackDelivery, navigateToUrl]
  );

  /**
   * Check for initial notification (app launched from killed state via notification)
   */
  const checkInitialNotification = useCallback(async () => {
    try {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        logger.debug("App launched from notification:", response);
        handleNotificationResponse(response);
      }
    } catch (error) {
      logger.error("Failed to get initial notification:", error);
    }
  }, [handleNotificationResponse]);

  // Store callback refs to avoid effect re-runs
  const handleForegroundNotificationRef = useRef(handleForegroundNotification);
  const handleNotificationResponseRef = useRef(handleNotificationResponse);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    handleForegroundNotificationRef.current = handleForegroundNotification;
    handleNotificationResponseRef.current = handleNotificationResponse;
  });

  useEffect(() => {
    logger.debug("Setting up notification listeners...");

    // 1. Handle notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        handleForegroundNotificationRef.current(notification);
      });
    logger.debug("Foreground notification listener registered");

    // 2. Handle notification taps (app opened from background or killed state)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationResponseRef.current(response);
      });
    logger.debug("Response listener registered");

    // 3. Check for initial notification (app was killed, launched via notification)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        logger.debug("App launched from notification:", response);
        handleNotificationResponseRef.current(response);
      }
    });

    setIsInitialized(true);
    logger.debug("Notification listeners setup complete");

    return () => {
      logger.debug("Cleaning up notification listeners...");
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []); // Empty dependency array - only run once!

  return { isInitialized, sheetRef };
};

export default useNotificationListener;
