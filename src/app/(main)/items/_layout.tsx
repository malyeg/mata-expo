import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const ItemsLayout = () => {
  const screenOptions = useScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Items",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Item Details",
        }}
      />
    </Stack>
  );
};

export default ItemsLayout;
