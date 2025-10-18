import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
  const screenOptions = useScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="archived-items"
        options={{
          title: "Archived Items",
        }}
      />
      <Stack.Screen
        name="my-items"
        options={{
          title: "My Items",
        }}
      />
      <Stack.Screen
        name="wish-list"
        options={{
          title: "My Wish List",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
