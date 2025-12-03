import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeStackLayout = () => {
  const screenOptions = useScreenOptions();
  const { bottom } = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        ...screenOptions,
        contentStyle: {
          ...(screenOptions.contentStyle as object),
          paddingBottom: bottom,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default HomeStackLayout;
