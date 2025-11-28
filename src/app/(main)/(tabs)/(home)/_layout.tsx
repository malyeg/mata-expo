import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const HomeStackLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");

  return (
    <Stack
      screenOptions={{
        ...screenOptions,
        contentStyle: {
          ...(screenOptions.contentStyle as object),
          paddingBottom: 0,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          title: t("screens.itemDetails"),
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default HomeStackLayout;
