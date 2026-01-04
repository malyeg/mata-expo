// app/_layout.tsx

import configApi from "@/api/AppConfig";
import { toastConfig } from "@/components/core/Toaster";
import { initializeRTL } from "@/hooks/useLanguage";
import { initSentry, navigationIntegration, Sentry } from "@/lib/sentry";
import { useAuthStore } from "@/store/auth-store";
import useLocationStore from "@/store/location-store";
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  useFonts,
} from "@expo-google-fonts/cairo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { authGuards } from "../navigation/guards";

// Initialize Sentry
initSentry();

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

const InitialLayout = () => {
  const { initializeLocation, isInitialized: isLocationInitialized } =
    useLocationStore();
  const {
    _initializeOnFirstAccess,
    authListener,
    isInitialized: isAuthInitialized,
  } = useAuthStore();
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const initialize = async () => {
      // Initialize RTL settings first (before rendering)
      await initializeRTL();
      setIsLanguageInitialized(true);

      // Then run other initializations in parallel
      await Promise.all([
        _initializeOnFirstAccess(),
        initializeLocation(),
        configApi.fetchConfig(),
      ]);
    };

    initialize();

    return () => {
      authListener && authListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register navigation container with Sentry for navigation tracking
  useEffect(() => {
    if (navigationRef?.current) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  if (!isAuthInitialized || !isLocationInitialized || !isLanguageInitialized) {
    return null;
  }

  // Hide splash screen once everything is initialized
  SplashScreen.hideAsync();

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
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  // Wait for fonts to load
  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <InitialLayout />
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default Sentry.wrap(RootLayout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
