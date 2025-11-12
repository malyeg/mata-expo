// app/_layout.tsx

import { toastConfig } from "@/components/core/Toaster";
import { useAuthStore } from "@/store/auth-store";
import useLocationStore from "@/store/location-store";
import { getWarningsOff } from "@/utils/WarningsOff";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { algoliasearch } from "algoliasearch";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { authGuards } from "../navigation/guards";

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

if (
  !process.env.EXPO_PUBLIC_ALGOLIA_APP_ID ||
  !process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY
) {
  console.warn(
    "Algolia configuration is missing. Please set EXPO_PUBLIC_ALGOLIA_APP_ID and EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY in your .env file."
  );
} else {
  algoliasearch(
    process.env.EXPO_PUBLIC_ALGOLIA_APP_ID,
    process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY
  );
}

const InitialLayout = () => {
  const { initializeLocation } = useLocationStore();
  const { _initializeOnFirstAccess, authListener, isInitialized } =
    useAuthStore();

  useEffect(() => {
    _initializeOnFirstAccess();
    initializeLocation();

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
