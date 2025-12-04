import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import itemsApi, { Item } from "@/api/itemsApi";
import listsApi from "@/api/listsApi";
import useAuth from "@/hooks/useAuth";
import { QueryBuilder } from "@/types/DataTypes";
import Analytics from "@/utils/Analytics";

interface UseItemDetailsSnapshotProps {
  itemId: string;
  onSnapshot?: (item: Item) => void;
}

const useItemDetailsSnapshot = ({
  itemId,
  onSnapshot,
}: UseItemDetailsSnapshotProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const [item, setItem] = useState<Item>();
  const [wishItemId, setWishItemId] = useState<string | undefined>();
  const [isArchivedModalVisible, setArchivedModalVisible] = useState(false);
  const [isBlockedModalVisible, setBlockedModalVisible] = useState(false);

  useEffect(() => {
    if (!itemId) {
      router.replace("/items");
      return;
    }
    // Reset state when itemId changes
    setItem(undefined);
    setWishItemId(undefined);

    const unsubscribe = itemsApi.onDocumentSnapshot(
      itemId,
      (snapshot) => {
        if (snapshot) {
          onSnapshot?.(snapshot);
          setItem(snapshot);

          if (snapshot.status === "blocked" && user?.isAdmin !== true) {
            setBlockedModalVisible(true);
          }
          if (snapshot.archived && user?.id !== snapshot.user.id) {
            unsubscribe();
            setArchivedModalVisible(true);
          }

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
        }
      },
      (error) => console.log(error)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  return {
    item,
    setItem,
    wishItemId,
    setWishItemId,
    isArchivedModalVisible,
    setArchivedModalVisible,
    isBlockedModalVisible,
    setBlockedModalVisible,
  };
};

export default useItemDetailsSnapshot;
