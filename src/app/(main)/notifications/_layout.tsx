import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const NotificationsLayout = () => {
  const screenOptions = useScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
        }}
      />
    </Stack>
  );
};

export default NotificationsLayout;
