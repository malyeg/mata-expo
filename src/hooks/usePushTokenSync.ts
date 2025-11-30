import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { LoggerFactory } from "@/utils/logger";
import { useEffect, useRef } from "react";

const logger = LoggerFactory.getLogger("usePushTokenSync");

/**
 * Check if the token is a valid push token (not a simulator placeholder)
 */
const isValidPushToken = (token: string | undefined): boolean => {
  if (!token) return false;
  // Skip simulator tokens in development
  if (token === "simulator") return false;
  return true;
};

/**
 * Hook to sync the Expo push token to the user's Firestore profile.
 * - Initializes push notifications when the user is authenticated
 * - Syncs the token to the profile when first obtained
 * - Listens for token changes and updates the profile automatically
 */
const usePushTokenSync = () => {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const setProfile = useAuthStore((state) => state.setProfile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    pushToken,
    isInitialized,
    initialize,
    syncTokenToProfile,
    startTokenListener,
    stopTokenListener,
  } = useNotificationStore();

  const isSyncing = useRef(false);

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      logger.debug("User authenticated, initializing notifications...");
      initialize();
    }
  }, [isAuthenticated, isInitialized, initialize]);

  // Sync token to profile when token is available and profile exists
  useEffect(() => {
    const syncToken = async () => {
      if (!profile || !pushToken || isSyncing.current) {
        return;
      }

      // Skip invalid tokens (e.g., simulator placeholder)
      if (!isValidPushToken(pushToken)) {
        logger.debug("Skipping sync for invalid/simulator token");
        return;
      }

      // Skip for anonymous/guest users (they typically can't update their profile)
      if (user?.isAnonymous) {
        logger.debug("Skipping sync for anonymous user");
        return;
      }

      // Skip if token is already synced
      if (profile.token === pushToken) {
        logger.debug("Token already synced to profile");
        return;
      }

      isSyncing.current = true;
      try {
        logger.debug("Syncing push token to profile...");
        const updatedProfile = await syncTokenToProfile(profile);
        if (updatedProfile) {
          setProfile(updatedProfile);
          logger.debug("Profile updated with new push token");
        }
      } catch (error: any) {
        // Handle permission errors gracefully (e.g., guest users)
        if (error?.code === "firestore/permission-denied") {
          logger.warn("No permission to sync token - user may be a guest");
        } else {
          logger.error("Failed to sync token to profile:", error);
        }
      } finally {
        isSyncing.current = false;
      }
    };

    syncToken();
  }, [profile, user, pushToken, syncTokenToProfile, setProfile]);

  // Start listening for token changes
  useEffect(() => {
    if (!isAuthenticated || !profile) {
      return;
    }

    // Skip listener for anonymous users
    if (user?.isAnonymous) {
      return;
    }

    const handleTokenChange = async (newToken: string) => {
      if (!profile || isSyncing.current) {
        return;
      }

      // Skip invalid tokens
      if (!isValidPushToken(newToken)) {
        return;
      }

      // Skip if token is the same
      if (profile.token === newToken) {
        return;
      }

      isSyncing.current = true;
      try {
        logger.debug("Token changed, syncing to profile...", newToken);
        const updatedProfile = await syncTokenToProfile(profile);
        if (updatedProfile) {
          setProfile(updatedProfile);
          logger.debug("Profile updated with refreshed push token");
        }
      } catch (error: any) {
        if (error?.code === "firestore/permission-denied") {
          logger.warn("No permission to sync refreshed token");
        } else {
          logger.error("Failed to sync refreshed token to profile:", error);
        }
      } finally {
        isSyncing.current = false;
      }
    };

    startTokenListener(handleTokenChange);

    return () => {
      stopTokenListener();
    };
  }, [
    isAuthenticated,
    profile,
    user,
    syncTokenToProfile,
    setProfile,
    startTokenListener,
    stopTokenListener,
  ]);
};

export default usePushTokenSync;

