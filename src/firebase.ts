// src/firebase.ts
import "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { getFunctions } from "@react-native-firebase/functions";
import { getRemoteConfig } from "@react-native-firebase/remote-config";

export const auth = getAuth();
export const db = getFirestore();
export const functions = getFunctions();
export const remoteConfig = getRemoteConfig();
