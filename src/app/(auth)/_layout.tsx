// app/(auth)/_layout.tsx
import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AuthLayout = () => {
  // Redirect logic is handled in the root _layout.tsx
  // This layout just defines the stack navigator for the auth routes
  const { bottom } = useSafeAreaInsets();
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");
  return (
    <Stack
      initialRouteName="sign-in"
      screenOptions={{
        headerShown: false,
        ...screenOptions,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen
        name="legal-information"
        options={{
          headerShown: true,
          headerTitle: t("screens.legal"),
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
};

export default AuthLayout;
