import itemsApi from "@/api/itemsApi";
import useApi from "@/hooks/useApi";
import useLocale from "@/hooks/useLocale";
import useSheet from "@/hooks/useSheet";
import useToast from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Icon from "../core/Icon";
import Sheet from "../widgets/Sheet";
import AppMenuItem from "./AppMenuItem";

type DeleteItemMenuItemProps = {
  itemId: string;
  itemName?: string;
  closeMenu?: () => void;
};

const DeleteItemMenuItem = ({
  itemId,
  itemName,
  closeMenu,
  ...props
}: DeleteItemMenuItemProps) => {
  const { t } = useLocale("itemDetailsScreen");
  const { request, loader } = useApi();
  const { show, sheetRef } = useSheet();
  const { showToast, showErrorToast } = useToast();
  const router = useRouter();

  const handleDeleteItem = async () => {
    show({
      header: t("deleteConfirmationHeader"),
      body: t("deleteConfirmationBody", {
        params: { itemName: itemName ?? "" },
      }),
      cancelCallback: () => {
        closeMenu?.();
      },
      confirmCallback: async () => {
        closeMenu?.();
        try {
          await request(() => itemsApi.deleteById(itemId));
          showToast({
            message: t("menu.deleteLabel"),
            type: "success",
          });
          router.back();
        } catch (error) {
          showErrorToast(error);
        }
      },
    });
  };

  return (
    <>
      <AppMenuItem
        {...props}
        title={t("menu.deleteLabel")}
        onPress={handleDeleteItem}
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
            <Icon
              name="trash-can-outline"
              size={20}
              color={theme.colors.white}
            />
          </View>
        )}
      />
      <Sheet ref={sheetRef} />
      {loader}
    </>
  );
};

export { DeleteItemMenuItem };
