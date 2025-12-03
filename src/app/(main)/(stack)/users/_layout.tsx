import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const UsersLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: t("screens.userItems"),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: t("screens.userItems"),
        }}
      />
    </Stack>
  );
};

export default UsersLayout;
