import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const DealsLayout = () => {
  const screenOptions = useScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Deals",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Deal Details",
        }}
      />
    </Stack>
  );
};

export default DealsLayout;
