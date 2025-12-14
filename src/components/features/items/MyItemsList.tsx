import itemsApi, { Item, ItemStatus } from "@/api/itemsApi";
import { Button, Loader, Screen, Text } from "@/components/core";
import DataList from "@/components/widgets/DataList";
import ItemCard, { ITEM_CARD_HEIGHT } from "@/components/widgets/ItemCard";
import NoDataFound from "@/components/widgets/NoDataFound";
import { screens } from "@/config/constants";
import { useFirestoreQuery } from "@/hooks/db/useFirestoreQuery";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import { useAddItemStore } from "@/store/addItem-store";
import { theme } from "@/styles/theme";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

interface MyItemsListProps {
  status: ItemStatus[];
}

export const MyItemsList = ({ status }: MyItemsListProps) => {
  const { user } = useAuth();
  const { openAddItemModal } = useAddItemStore();

  const { data: items, loading } = useFirestoreQuery<Item>(
    itemsApi.collectionName,
    (ref) => {
      return ref.where("user.id", "==", user?.id).where("status", "in", status);
    }
  );

  const { t } = useLocale(screens.MY_ITEMS);

  const renderItem = ({ item }: any) => (
    <ItemCard style={styles.card} item={item as Item} showActivityStatus />
  );

  const NoData = (
    <NoDataFound style={styles.card} title={t("noData.title")}>
      <Button type="link" onPress={openAddItemModal}>
        <Text style={styles.noDataLink}>{t("addNewItemLinkTitle")}</Text>
      </Button>
    </NoDataFound>
  );

  const listData = useMemo(
    () => ({
      items: items ?? [],
    }),
    [items]
  );

  return (
    <Screen scrollable={false} style={styles.screen}>
      {!loading ? (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          showsVerticalScrollIndicator={false}
          data={listData}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={2}
          renderItem={renderItem}
          itemSize={ITEM_CARD_HEIGHT}
          ListEmptyComponent={NoData}
        />
      ) : (
        <Loader />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  datalist: { flex: 1 },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    flexBasis: "48%",
  },
  noDataLink: {
    marginTop: 10,
    color: theme.colors.salmon,
    ...theme.styles.scale.h5,
    textDecorationLine: "underline",
  },
});

export default MyItemsList;

