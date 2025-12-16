// src/firebase.ts
import { getAnalytics } from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { getFirestore } from "@react-native-firebase/firestore";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";
import { getMessaging } from "@react-native-firebase/messaging";
import { getRemoteConfig } from "@react-native-firebase/remote-config";
import { getStorage } from "@react-native-firebase/storage";
import { Platform } from "react-native";

export const app = getApp();
export const auth = getAuth();
export const db = getFirestore();
export const functions = getFunctions(app, "australia-southeast1");
export const remoteConfig = getRemoteConfig();
export const crashlytics = getCrashlytics();
export const storage = getStorage();
export const messaging = getMessaging();
export const analytics = getAnalytics();

const FUNCTIONS_REGION = "australia-southeast1";
const PROJECT_ID = app.options.projectId;

// Token cache for Android workaround
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

/**
 * Get a cached token or refresh if expired/expiring soon.
 * Tokens are valid for 1 hour, we refresh 5 min before expiry.
 */
const getCachedToken = async (): Promise<string> => {
  const now = Date.now();
  const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes before expiry

  // If we have a cached token that won't expire in the next 5 min, use it
  if (cachedToken && tokenExpiryTime > now + REFRESH_BUFFER_MS) {
    return cachedToken;
  }

  // Otherwise, get a fresh token (force refresh only if we had a cached one)
  const forceRefresh = cachedToken !== null;
  const token = await auth.currentUser!.getIdToken(forceRefresh);

  // Firebase tokens are valid for 1 hour
  cachedToken = token;
  tokenExpiryTime = now + 60 * 60 * 1000; // 1 hour from now

  return token;
};

// Clear token cache on auth state change
auth.onAuthStateChanged(() => {
  cachedToken = null;
  tokenExpiryTime = 0;
});

/**
 * Helper to call Firebase Cloud Functions.
 * Uses direct HTTP on Android to work around auth token issues.
 */
export const callFunction = <TData = unknown, TResult = unknown>(
  name: string
) => {
  return async (data?: TData) => {
    // On Android, use direct HTTP call to work around auth token not being attached
    if (Platform.OS === "android" && auth.currentUser) {
      try {
        const token = await getCachedToken();
        const url = `https://${FUNCTIONS_REGION}-${PROJECT_ID}.cloudfunctions.net/${name}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return { data: result.result ?? result } as { data: TResult };
      } catch (error) {
        console.error("Cloud Function call failed:", error);
        throw error;
      }
    }

    // iOS and other platforms use the SDK
    const callable = httpsCallable<TData, TResult>(functions, name);
    return callable(data);
  };
};
