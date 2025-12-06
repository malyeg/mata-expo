import AppMenu from "@/components/menu/AppMenu";
import { DeleteItemMenuItem } from "@/components/menu/DeleteItemMenuItem";
import SendComplainItem from "@/components/menu/SendComplainMenuItem";
import ShareMenuItem from "@/components/menu/ShareMenuItem";
import useAuth from "@/hooks/useAuth";
import React from "react";

type ItemDetailsMenuProps = {
  itemId: string;
  itemName?: string;
  itemOwnerId?: string;
};

const ItemDetailsMenu = ({
  itemId,
  itemName,
  itemOwnerId,
}: ItemDetailsMenuProps) => {
  const { user } = useAuth();
  const isOwnItem = user?.id === itemOwnerId;

  return (
    <AppMenu>
      <ShareMenuItem link={`items/itemId`} />
      {!isOwnItem && <SendComplainItem itemId={itemId} />}
      {isOwnItem && (
        <>
          {/* <EditItemMenuItem itemId={itemId} /> */}
          <DeleteItemMenuItem itemId={itemId} itemName={itemName} />
        </>
      )}
    </AppMenu>
  );
};

export default ItemDetailsMenu;
