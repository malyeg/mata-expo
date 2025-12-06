import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const ItemsLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: t("screens.items"),
          contentStyle: {
            ...(screenOptions.contentStyle as object),
            paddingBottom: 0,
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: t("screens.itemDetails"),
        }}
      />
    </Stack>
  );
};

export default ItemsLayout;
