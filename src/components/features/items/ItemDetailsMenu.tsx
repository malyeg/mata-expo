import AppMenu from "@/components/menu/AppMenu";
import SendComplainItem from "@/components/menu/SendComplainMenuItem";
import ShareMenuItem from "@/components/menu/ShareMenuItem";
import React from "react";
import { StyleSheet } from "react-native";

const ItemDetailsMenu = ({ itemId }: { itemId: string }) => {
  return (
    <>
      {/* <Text selectionColor={theme.colors.primary}>Menu</Text> */}
      <AppMenu>
        <ShareMenuItem link={`items/itemId`} />
        <SendComplainItem itemId={itemId} />
        {/* <ProviderDetailsMenuItem branch={order.branch} />
      <CallProviderMenuItem branch={order.branch} />
      <ReportIssueMenuItem order={order} /> */}
      </AppMenu>
    </>
  );
};

export default ItemDetailsMenu;

const styles = StyleSheet.create({});
