import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Stack } from "expo-router";
import React from "react";

const MyItemsLayout = () => {
  const { t } = useLocale("common");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.white,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("screens.myItems"),
        }}
      />
    </Stack>
  );
};

export default MyItemsLayout;
