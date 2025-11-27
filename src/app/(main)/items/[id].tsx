import { ItemDetailsContent } from "@/components/features/items/ItemDetailsContent";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

export const ITEM_DETAILS_SCREEN_NAME = "ItemDetailsScreen";

const ItemDetailsScreen = () => {
  const router = useRouter();
  const { id: itemId } = useLocalSearchParams<{ id: string }>();

  if (!itemId) {
    router.replace("/items");
    return null;
  }

  return <ItemDetailsContent itemId={itemId} />;
};

export default ItemDetailsScreen;
