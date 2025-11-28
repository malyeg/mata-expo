import useLocale from "@/hooks/useLocale";
import useScreenOptions from "@/hooks/useScreenOptions";
import { Stack } from "expo-router";
import React from "react";

const LegalInfoLayout = () => {
  const screenOptions = useScreenOptions();
  const { t } = useLocale("common");
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: t("screens.legal"),
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: t("screens.privacy"),
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
};

export default LegalInfoLayout;
