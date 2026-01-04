import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const DealsLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="archived"
        options={{
          title: t("screens.archivedDeals"),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: t("screens.dealDetails"),
        }}
      />
    </Stack>
  );
};

export default DealsLayout;
