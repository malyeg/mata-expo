import AppMenu from "@/components/menu/AppMenu";
import ShareMenuItem from "@/components/menu/ShareMenuItem";
import React from "react";
import { StyleSheet } from "react-native";

const ItemDetailsMenu = () => {
  return (
    <>
      {/* <Text selectionColor={theme.colors.primary}>Menu</Text> */}
      <AppMenu>
        <ShareMenuItem link={`items/itemId`} />
        {/* <ProviderDetailsMenuItem branch={order.branch} />
      <CallProviderMenuItem branch={order.branch} />
      <ReportIssueMenuItem order={order} /> */}
      </AppMenu>
    </>
  );
};

export default ItemDetailsMenu;

const styles = StyleSheet.create({});
