import React from "react";
import type { AppMenuItemProps } from "./AppMenuItem";
import AppMenuItem from "./AppMenuItem";
import i18n from "@/utils/i18n";
import theme from "@/components/theme";
import { useRouter } from "expo-router";
import { MapPinIcon } from "../Icons";
import type { Branch } from "@/models/branch.model";
import { View } from "react-native";

type ProviderDetailsMenuItemProps = Omit<
  AppMenuItemProps,
  "title" | "onPress"
> & {
  branch: Branch;
};

const ProviderDetailsMenuItem = ({
  branch,
  ...props
}: ProviderDetailsMenuItemProps) => {
  const router = useRouter();
  const onPress = () => {
    router.navigate({
      pathname: "/providers/[id]",
      params: { id: branch.id }
    });
  };
  return (
    <AppMenuItem
      {...props}
      title={i18n.t("common.appMenu.providerDetailsLabel")}
      onPress={onPress}
      icon={() => (
        <View
          style={{
            backgroundColor: theme.colors.darkGreen,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            width: 30,
            height: 30
          }}
        >
          <MapPinIcon size={15} color={theme.colors.light} />
        </View>
      )}
    />
  );
};

export default ProviderDetailsMenuItem;
