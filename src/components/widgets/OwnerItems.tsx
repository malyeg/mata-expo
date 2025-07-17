import itemsApi, { Item, ItemStatus } from "@/api/itemsApi";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Document, Operation, QueryBuilder } from "@/types/DataTypes";
import React, { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "../core";
import DataList from "./DataList";
import ItemCard from "./ItemCard";

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface ItemListProps {
  item: Item;
  style?: StyleProp<ViewStyle>;
}
const OwnerItems = ({ item, style }: ItemListProps) => {
  const { t } = useLocale("itemDetailsScreen");
  const listHeaderComponent = useMemo(
    () => <Text style={styles.ownerHeaderText}>{t("ownerItemsTitle")}</Text>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const loadData = useMemo(
    () => async (doc?: Document<Item>) => {
      try {
        const filters = [
          { field: "userId", value: item.userId },
          { field: "id", value: item?.id, operation: Operation.NOT_EQUAL },
          { field: "status", value: "online" as ItemStatus },
        ];
        const query = new QueryBuilder<Item>()
          .filters(filters)
          .after(doc)
          .limit(10)
          .build();

        const response = await itemsApi.getAll(query);

        return response;
      } catch (error) {
        console.error("error", error);
      }
    },
    [item]
  );

  const renderItem = ({ item }) => <ItemCard item={item} showSwapIcon />;

  return (
    <View style={[styles.container, style]}>
      {item && (
        <DataList
          loaderStyle={styles.dataListHeight}
          refreshing={false}
          onRefresh={undefined}
          horizontal
          pageable
          data={loadData}
          renderItem={renderItem}
          itemSize={ITEM_HEIGHT}
          ListEmptyComponent={<View />}
          HeaderComponent={listHeaderComponent}
        />
      )}
    </View>
  );
};

export default React.memo(OwnerItems);

const styles = StyleSheet.create({
  container: {},
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
  },
  dataListHeight: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
  },
  itemsLink: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
  },
  flatList: {
    flexGrow: 0,
  },
  card: {
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: 150,
    height: 200,
    padding: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 6,
  },
  eyeIcon: {
    paddingRight: 5,
  },
  pressableContainer: {
    flex: 3,
    marginBottom: 5,
  },
  image: {
    flex: 1,
  },
  cardCategory: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    width: "100%",
    borderTopColor: theme.colors.lightGrey,
    borderTopWidth: 2,
  },
  listActivityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'grey',
  },
  ownerHeaderText: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
    marginBottom: 5,
  },
});
