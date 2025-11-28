import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const ProfileLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: t("screens.profile"),
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: t("screens.editProfile"),
        }}
      />
      <Stack.Screen
        name="archived-items"
        options={{
          title: t("screens.myArchivedItems"),
        }}
      />
      <Stack.Screen
        name="my-items"
        options={{
          title: t("screens.myItems"),
        }}
      />
      <Stack.Screen
        name="wish-list"
        options={{
          title: t("screens.wishList"),
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: t("screens.changePassword"),
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
