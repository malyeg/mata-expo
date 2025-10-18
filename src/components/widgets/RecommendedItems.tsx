import { ApiResponse } from "@/api/Api";
import itemsApi, { Item, ItemStatus } from "@/api/itemsApi";
import { Location } from "@/api/locationApi";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Operation, QueryBuilder } from "@/types/DataTypes";
import React, { useEffect, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "../core";
import DataList from "./DataList";
import NoDataFound from "./NoDataFound";
import RecommendedCard from "./RecommendedCard";

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface RecommendedItemsProps {
  location: Location;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

const RecommendedItems = ({
  location,
  title,
  style,
}: RecommendedItemsProps) => {
  const { user, profile } = useAuth();
  const [itemsResponse, setItemsResponse] = useState<ApiResponse<Item>>();

  const { t } = useLocale("widgets");

  useEffect(() => {
    const targetCategories = profile?.targetCategories;
    if (!targetCategories || targetCategories.length === 0) {
      return;
    }
    const locationFilter = location.state
      ? { field: "location.state.id", value: location?.state.id }
      : { field: "location.city.id", value: location?.city?.id };
    const query = new QueryBuilder<Item>()
      .filters([
        locationFilter,
        { field: "status", value: "online" as ItemStatus },
        {
          field: "category.id",
          operation: Operation.IN,
          value: targetCategories,
        },
      ])
      .orderBy("timestamp", "desc")
      .limit(20)
      .build();
    const unsubscribe = itemsApi.onQuerySnapshot(
      (snapshot) => {
        if (snapshot.data) {
          setItemsResponse({
            items: snapshot.data.filter(
              (item) => item.userId !== user?.id && item.archived !== true
            ), // workaround to firestore query limitation with timestamp order
          });
        }
      },
      (error) => {
        console.log(error);
      },
      query
    );

    return unsubscribe;
  }, [location?.city, location?.state, profile?.targetCategories, user.id]);

  const listEmptyComponent = (
    <NoDataFound body={"no items found in " + location.state?.name} icon="" />
  );

  const renderItem = ({ item }) => (
    <RecommendedCard showSwapIcon item={item as Item} />
  );
  const onEndReached = (info: any, length: number) => {
    if (length > 20) {
      // TODO navigate to recommended items screen
    }
  };

  return itemsResponse && itemsResponse.items.length > 0 ? (
    // return false ? (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title ?? t("recommendedItems.title")}</Text>
      </View>
      <DataList
        loaderStyle={styles.dataListHeight}
        refreshing={false}
        onRefresh={undefined}
        horizontal
        data={itemsResponse!}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        itemSize={ITEM_HEIGHT}
        onEndReached={onEndReached}
      />
    </View>
  ) : null;
};

export default React.memo(RecommendedItems);

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
    fontWeight: theme.fontWeight.bold,
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
  anotherAreaLink: {
    textDecorationLine: "underline",
  },
});
