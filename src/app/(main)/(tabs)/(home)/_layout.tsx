import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeStackLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");
  const { bottom } = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        ...screenOptions,
        contentStyle: {
          ...(screenOptions.contentStyle as object),
          paddingBottom: bottom,
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
