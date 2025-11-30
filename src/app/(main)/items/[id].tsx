import { ItemDetailsContent } from "@/components/features/items/ItemDetailsContent";
import ItemDetailsMenu from "@/components/features/items/ItemDetailsMenu";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export const ITEM_DETAILS_SCREEN_NAME = "ItemDetailsScreen";

const ItemDetailsScreen = () => {
  const router = useRouter();
  const { id: itemId } = useLocalSearchParams<{ id: string }>();

  if (!itemId) {
    router.replace("/items");
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: ItemDetailsMenu,
        }}
      />
      <ItemDetailsContent itemId={itemId} />
    </>
  );
};

export default ItemDetailsScreen;
