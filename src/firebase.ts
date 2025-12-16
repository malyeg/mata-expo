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

export const app = getApp();
export const auth = getAuth();
export const db = getFirestore();
export const functions = getFunctions(app, "australia-southeast1");
export const remoteConfig = getRemoteConfig();
export const crashlytics = getCrashlytics();
export const storage = getStorage();
export const messaging = getMessaging();
export const analytics = getAnalytics();

/**
 * Helper to call Firebase Cloud Functions.
 */
export const callFunction = <TData = unknown, TResult = unknown>(
  name: string
) => {
  return (data?: TData) => {
    console.log("Current user:", auth.currentUser?.uid);

    const callable = httpsCallable<TData, TResult>(functions, name);
    return callable(data);
  };
};
