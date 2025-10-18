import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const ContactUsLayout = () => {
  const screenOptions = useScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "FAQs",
        }}
      />
    </Stack>
  );
};

export default ContactUsLayout;
