// src/firebase.ts
import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { getFunctions } from "@react-native-firebase/functions";
import { getRemoteConfig } from "@react-native-firebase/remote-config";

// grab the default native-initialized app
const app = getApp();

// pass the app instance into each service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const remoteConfig = getRemoteConfig(app);
