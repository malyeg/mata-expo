import { Item } from "@/api/itemsApi";
import useLocale from "@/hooks/useLocale";
import { useAddItemStore } from "@/store/addItem-store";
import { theme } from "@/styles/theme";
import React from "react";
import { View } from "react-native";
import Icon from "../core/Icon";
import AppMenuItem from "./AppMenuItem";

type EditItemMenuItemProps = {
  item: Item;
  closeMenu?: () => void;
};

const EditItemMenuItem = ({
  item,
  closeMenu,
  ...props
}: EditItemMenuItemProps) => {
  const { t } = useLocale("itemDetailsScreen");
  const { openEditItemModal } = useAddItemStore();

  const handleEditItem = () => {
    console.log("Edit pressed. Closing menu...");
    closeMenu?.();

    // Wait for menu to close completely
    setTimeout(() => {
      openEditItemModal(item);
    }, 700);
  };

  return (
    <AppMenuItem
      {...props}
      title={t("menu.editItemLabel")}
      onPress={handleEditItem}
      icon={() => (
        <View
          style={{
            backgroundColor: theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            width: 30,
            height: 30,
          }}
        >
          <Icon name="pencil-outline" size={20} color={theme.colors.white} />
        </View>
      )}
    />
  );
};

export { EditItemMenuItem };
