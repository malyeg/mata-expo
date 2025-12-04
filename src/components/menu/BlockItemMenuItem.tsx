import itemsApi from "@/api/itemsApi";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import useSheet from "@/hooks/useSheet";
import useToast from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { BlockIcon } from "../core/Icon";
import Sheet from "../widgets/Sheet";
import AppMenuItem from "./AppMenuItem";

type BlockItemMenuItemProps = {
  itemId: string;
  itemName?: string;
  closeMenu?: () => void;
};

const BlockItemMenuItem = ({
  itemId,
  itemName,
  closeMenu,
  ...props
}: BlockItemMenuItemProps) => {
  const { t } = useLocale("itemDetailsScreen");
  const { user } = useAuth();
  const { request, loader } = useApi();
  const { show, sheetRef } = useSheet();
  const { showToast, showErrorToast } = useToast();
  const router = useRouter();

  const handleBlockItem = async () => {
    show({
      header: t("blockItemConfirmation.header"),
      body: t("blockItemConfirmation.body", {
        params: { itemName: itemName ?? "" },
      }),
      cancelCallback: () => {
        closeMenu?.();
      },
      confirmCallback: async () => {
        closeMenu?.();
        try {
          const item = await request(() => itemsApi.getById(itemId));
          if (item) {
            await request(() => itemsApi.blockItem(itemId));
            showToast({
              message: t("menu.blockLabel"),
              type: "success",
            });
            router.back();
          }
        } catch (error) {
          showErrorToast(error);
        }
      },
    });
  };

  // Only show block option for users who don't own the item
  if (!user || user.isAnonymous) {
    return null;
  }

  return (
    <>
      <AppMenuItem
        {...props}
        title={t("menu.blockLabel")}
        onPress={handleBlockItem}
        icon={() => (
          <View
            style={{
              backgroundColor: theme.colors.error,
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
      <Sheet ref={sheetRef} />
      {loader}
    </>
  );
};

export { BlockItemMenuItem };
