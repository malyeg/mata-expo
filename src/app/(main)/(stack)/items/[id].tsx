import { Loader } from "@/components/core";
import { ItemDetailsContent } from "@/components/features/items/ItemDetailsContent";
import ItemDetailsMenu from "@/components/features/items/ItemDetailsMenu";
import { useItemDetails } from "@/hooks/useItemDetails";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

const ItemDetailsScreen = () => {
  const router = useRouter();
  const { id: itemId } = useLocalSearchParams<{ id: string }>();

  const {
    item,
    loading,
    wishItemId,
    isArchivedModalVisible,
    isBlockedModalVisible,
    setArchivedModalVisible,
    setBlockedModalVisible,
    toggleWishList,
    deleteItem,
    refreshItem,
  } = useItemDetails({ itemId });

  if (!itemId) {
    router.back();
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <ItemDetailsMenu item={item} />,
        }}
      />
      <ItemDetailsContent
        item={item}
        loading={loading}
        wishItemId={wishItemId}
        isArchivedModalVisible={isArchivedModalVisible}
        isBlockedModalVisible={isBlockedModalVisible}
        setArchivedModalVisible={setArchivedModalVisible}
        setBlockedModalVisible={setBlockedModalVisible}
        toggleWishList={toggleWishList}
        deleteItem={deleteItem}
        refreshItem={refreshItem}
      />
    </>
  );
};

export default ItemDetailsScreen;
