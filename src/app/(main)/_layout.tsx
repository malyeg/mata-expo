// app/(app)/_layout.tsx
import { Stack } from "expo-router"; // Or Tabs
import React from "react";

const AppLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AppLayout;
