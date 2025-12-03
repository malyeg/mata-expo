import { useCallback, useEffect, useRef, useState } from "react";

import itemsApi, { Item } from "@/api/itemsApi";
import listsApi, { ListItem } from "@/api/listsApi";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import { QueryBuilder } from "@/types/DataTypes";
import Analytics from "@/utils/Analytics";
import { useRouter } from "expo-router";

interface UseItemDetailsOptions {
  itemId: string | undefined;
  onItemBlocked?: () => void;
  onItemArchived?: () => void;
}

interface UseItemDetailsResult {
  item: Item | undefined;
  loading: boolean;
  wishItemId: string | undefined;
  isArchivedModalVisible: boolean;
  isBlockedModalVisible: boolean;
  setArchivedModalVisible: (visible: boolean) => void;
  setBlockedModalVisible: (visible: boolean) => void;
  toggleWishList: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItem: React.MutableRefObject<boolean>;
}

export function useItemDetails({
  itemId,
  onItemBlocked,
  onItemArchived,
}: UseItemDetailsOptions): UseItemDetailsResult {
  const router = useRouter();
  const [item, setItem] = useState<Item>();
  const [loading, setLoading] = useState(true);
  const [wishItemId, setWishItemId] = useState<string | undefined>();
  const [isArchivedModalVisible, setArchivedModalVisible] = useState(false);
  const [isBlockedModalVisible, setBlockedModalVisible] = useState(false);

  const refreshItem = useRef(false);

  const { request } = useApi();
  const { user, sharedUser, addTargetCategory } = useAuth();
  const { showErrorToast } = useToast();

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    // Reset state when itemId changes
    setItem(undefined);
    setWishItemId(undefined);
    setLoading(true);

    const unsubscribe = itemsApi.onDocumentSnapshot(
      itemId,
      (snapshot) => {
        if (snapshot) {
          setItem(snapshot);
          setLoading(false);

          if (snapshot.status === "blocked" && user?.isAdmin !== true) {
            setBlockedModalVisible(true);
            onItemBlocked?.();
          }
          if (snapshot.archived && user?.id !== snapshot.user.id) {
            unsubscribe();
            setArchivedModalVisible(true);
            onItemArchived?.();
          }

          // Fetch wishlist status
          const query = QueryBuilder.from({
            filters: [
              { field: "user.id", value: user?.id },
              { field: "item.id", value: snapshot.id },
            ],
            limit: 1,
          });
          if (user?.id !== snapshot?.userId) {
            listsApi.getAll(query).then((listItemResponse) => {
              if (listItemResponse && listItemResponse.length > 0) {
                setWishItemId(listItemResponse[0].id);
              } else {
                setWishItemId("");
              }
            });
          }
          Analytics.viewItem(snapshot);
        } else {
          setLoading(false);
        }
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [itemId, user?.id, user?.isAdmin, onItemBlocked, onItemArchived]);

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await request(() => itemsApi.deleteById(id));
        router.back();
      } catch (error) {
        showErrorToast(error);
      }
    },
    [request, router, showErrorToast]
  );

  const toggleWishList = useCallback(async () => {
    if (!user || !item) return;

    try {
      if (wishItemId && wishItemId !== "") {
        await request(() => listsApi.deleteById(wishItemId));
        setWishItemId("");
      } else {
        const newWishItem = await request<ListItem>(() =>
          listsApi.create({
            userId: user.id,
            type: "wish",
            user: sharedUser,
            item: item,
          })
        );
        setWishItemId(newWishItem.id);
        Analytics.logAddItemToWishlist([item]);
        addTargetCategory(item?.category?.id!);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user, item, wishItemId, request, sharedUser, addTargetCategory]);

  return {
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
  };
}

export default useItemDetails;
