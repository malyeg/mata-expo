// app/(auth)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AuthLayout = () => {
  // Redirect logic is handled in the root _layout.tsx
  // This layout just defines the stack navigator for the auth routes
  const { bottom } = useSafeAreaInsets();
  return (
    <Stack
      initialRouteName="sign-in"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          flex: 1,
          paddingTop: 0,
          paddingBottom: bottom,
          // backgroundColor: "red",
        },
        headerStyle: {
          backgroundColor: "white",
        },
        headerTitleStyle: {
          color: "red",
          fontWeight: "bold",
        },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Ionicons
              name="chevron-back"
              size={24}
              color="red"
              style={{ marginLeft: 10 }}
            />
          ) : null,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="legal-information" />
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
