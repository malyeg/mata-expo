import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const ItemLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="[id]"
        options={{
          title: t("screens.itemDetails"),
        }}
      />
    </Stack>
  );
};

export default ItemLayout;
