import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const UsersLayout = () => {
  const screenOptions = useScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Users",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "User Details",
        }}
      />
    </Stack>
  );
};

export default UsersLayout;
