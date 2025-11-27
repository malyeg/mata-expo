// app/_layout.tsx

import configApi from "@/api/AppConfig";
import { toastConfig } from "@/components/core/Toaster";
import { useAuthStore } from "@/store/auth-store";
import useLocationStore from "@/store/location-store";
import { getWarningsOff } from "@/utils/WarningsOff";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { authGuards } from "../navigation/guards";

void SplashScreen.preventAutoHideAsync();
// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

console.log("WarningsOff", getWarningsOff());

const InitialLayout = () => {
  const { initializeLocation, isInitialized: isLocationInitialized } =
    useLocationStore();
  const {
    _initializeOnFirstAccess,
    authListener,
    isInitialized: isAuthInitialized,
  } = useAuthStore();

  useEffect(() => {
    // run in parallel
    Promise.all([
      _initializeOnFirstAccess(),
      initializeLocation(),
      configApi.fetchConfig(),
    ]);

    return () => {
      authListener && authListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("isInitialized ", isLocationInitialized, isAuthInitialized);

  if (!isAuthInitialized || !isLocationInitialized) {
    console.log("InitialLayout - Waiting for auth store initialization...");
    SplashScreen.hideAsync();
    return null; // or a loading component  ئ                                                 ** *
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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <InitialLayout />
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
