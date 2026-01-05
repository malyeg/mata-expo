import { Item } from "@/api/itemsApi";
import AppMenu from "@/components/menu/AppMenu";
import { BlockItemMenuItem } from "@/components/menu/BlockItemMenuItem";
import { DeleteItemMenuItem } from "@/components/menu/DeleteItemMenuItem";
import { EditItemMenuItem } from "@/components/menu/EditItemMenuItem";
import SendComplainItem from "@/components/menu/SendComplainMenuItem";
import ShareMenuItem from "@/components/menu/ShareMenuItem";
import useAuth from "@/hooks/useAuth";
import React from "react";

type ItemDetailsMenuProps = {
  item: Item;
};

const ItemDetailsMenu = ({ item }: ItemDetailsMenuProps) => {
  const itemId = item.id;
  const itemOwnerId = item.userId;
  const itemName = item.name;
  const { user } = useAuth();
  const isOwnItem = user?.id === itemOwnerId;
  const isAdmin = user?.rules?.includes("admin");

  // Hide menu if item is archived
  if (item.status === "archived") {
    return null;
  }

  return (
    <AppMenu>
      <ShareMenuItem link={`items/itemId`} />
      {!isOwnItem && <SendComplainItem itemId={itemId} />}

      {isOwnItem && <EditItemMenuItem item={item} />}
      {isOwnItem && <DeleteItemMenuItem itemId={itemId} itemName={itemName} />}
      {isAdmin && (
        <BlockItemMenuItem
          itemId={itemId}
          itemName={itemName}
          isBlocked={item.status === "blocked"}
        />
      )}
    </AppMenu>
  );
};

export default ItemDetailsMenu;
