// app/_layout.tsx
import { toastConfig } from "@/components/core/Toaster";
import { useAuthStore } from "@/store/auth-store";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { authGuards } from "../navigation/guards";
declare global {
  var RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS: boolean | undefined;
}

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

const InitialLayout = () => {
  const { _initializeOnFirstAccess, authListener, isInitialized } =
    useAuthStore();

  useEffect(() => {
    _initializeOnFirstAccess();

    return () => {
      authListener && authListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialized) {
    console.log("InitialLayout - Waiting for auth store initialization...");
    return null; // or a loading component
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={authGuards.canAccessAuth()}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={authGuards.canAccessApp()}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>
    </Stack>
  );
};

// Main Root Layout component
const RootLayout = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <InitialLayout />
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
