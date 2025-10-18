import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const LegalInfoLayout = () => {
  const screenOptions = useScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Legal Information",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
};

export default LegalInfoLayout;
