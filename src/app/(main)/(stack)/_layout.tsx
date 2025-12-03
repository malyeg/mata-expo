import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const MainStackLayout = () => {
  const screenOptions = useScreenOptions();

  return (
    <Stack
      screenOptions={{
        ...screenOptions,
        contentStyle: {
          ...(screenOptions.contentStyle as object),
          paddingBottom: 0,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="items" options={{ headerShown: false }} />
      <Stack.Screen name="deals" options={{ headerShown: false }} />
      <Stack.Screen name="users" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ headerShown: false }} />
      <Stack.Screen name="add-item" options={{ headerShown: true }} />
    </Stack>
  );
};

export default MainStackLayout;
