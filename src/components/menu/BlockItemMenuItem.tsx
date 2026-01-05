import itemsApi from "@/api/itemsApi";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import useSheet from "@/hooks/useSheet";
import useToast from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import React from "react";
import { View } from "react-native";
import { BlockIcon } from "../core/Icon";
import Sheet from "../widgets/Sheet";
import AppMenuItem from "./AppMenuItem";

type BlockItemMenuItemProps = {
  itemId: string;
  itemName?: string;
  isBlocked?: boolean;
  closeMenu?: () => void;
  onBlocked?: () => void;
};

const BlockItemMenuItem = ({
  itemId,
  itemName,
  isBlocked = false,
  closeMenu,
  onBlocked,
  ...props
}: BlockItemMenuItemProps) => {
  const { t } = useLocale("itemDetailsScreen");
  const { user } = useAuth();
  const { request, loader } = useApi();
  const { show, sheetRef } = useSheet();
  const { showToast, showErrorToast } = useToast();

  const handleBlockItem = async () => {
    const confirmationKey = isBlocked
      ? "unblockItemConfirmation"
      : "blockItemConfirmation";
    const actionLabel = isBlocked ? "menu.unblockLabel" : "menu.blockLabel";

    show({
      header: t(`${confirmationKey}.header`),
      body: t(`${confirmationKey}.body`, {
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
            if (isBlocked) {
              await request(() => itemsApi.unblockItem(itemId));
            } else {
              await request(() => itemsApi.blockItem(itemId));
            }
            showToast({
              message: t(actionLabel),
              type: "success",
            });
            onBlocked?.();
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

  const menuLabel = isBlocked ? t("menu.unblockLabel") : t("menu.blockLabel");
  const iconColor = isBlocked ? theme.colors.green : theme.colors.error;

  return (
    <>
      <AppMenuItem
        {...props}
        title={menuLabel}
        onPress={handleBlockItem}
        icon={() => (
          <View
            style={{
              backgroundColor: iconColor,
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
