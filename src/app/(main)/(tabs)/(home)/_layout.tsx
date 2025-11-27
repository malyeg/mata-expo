import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const HomeStackLayout = () => {
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
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          title: "Item Details",
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default HomeStackLayout;
