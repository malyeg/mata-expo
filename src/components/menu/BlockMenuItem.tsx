import itemsApi from "@/api/itemsApi";
import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import React from "react";
import { View } from "react-native";
import { BlockIcon } from "../core/Icon";
import AppMenuItem from "./AppMenuItem";

type ShareMenuItemProps = {
  itemId: string;
};

const BlockMenuItem = ({ itemId, ...props }: ShareMenuItemProps) => {
  const { t } = useLocale("common");
  const action = () => {
    show({
      // type: 'alert',
      header: t("blockItemConfirmation.header"),
      body: t("blockItemConfirmation.body", {
        params: { itemName: item.name },
      }),
      confirmCallback: () => itemsApi.blockItem({ id: itemId }),
    });
  };
  return (
    <AppMenuItem
      {...props}
      title={t("appMenu.shareLabel")}
      onPress={action}
      icon={() => (
        <View
          style={{
            backgroundColor: theme.colors.secondary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            width: 30,
            height: 30,
          }}
        >
          <BlockIcon size={20} color={theme.colors.white} />
        </View>
      )}
    />
  );
};

export default BlockMenuItem;
