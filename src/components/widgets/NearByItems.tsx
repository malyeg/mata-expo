import useLocation from "@/hooks/useLocation";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ApiResponse } from "../../api/Api";
import itemsApi, { Item, ItemStatus } from "../../api/itemsApi";
import useAuth from "../../hooks/useAuth";
import useLocale from "../../hooks/useLocale";
import theme from "../../styles/theme";
import { Filter, Operation, QueryBuilder } from "../../types/DataTypes";
import { Text } from "../core";
import DataList from "./DataList";
import ItemCard from "./ItemCard";
import NoDataFound from "./NoDataFound";

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface NearByItemsProps {
  // items: Item[];
  // city: string;
  // lastRefresh?: Date;
  title?: string;
  style?: StyleProp<ViewStyle>;
}
const NearByItems = ({ style }: NearByItemsProps) => {
  const { user } = useAuth();
  const [itemsResponse, setItemsResponse] = useState<ApiResponse<Item>>();

  const { t } = useLocale("widgets");
  const { location } = useLocation();
  const router = useRouter();
  const locText = location?.state?.name ?? location?.city?.name;

  useEffect(() => {
    if (!location) {
      return;
    }
    const filters: Filter<Item>[] = [
      location.state
        ? {
            field: "location.state.id",
            value: location?.state?.id,
          }
        : {
            field: "location.city.id",
            value: location?.city?.id,
          },
      { field: "status", value: "online" as ItemStatus },
      { field: "userId", value: user?.id, operation: Operation.NOT_EQUAL },
    ];
    const query = new QueryBuilder<Item>().filters(filters).limit(50).build();
    const unsubscribe = itemsApi.onQuerySnapshot(
      (snapshot) => {
        console.log(snapshot.data[0].category);
        setItemsResponse({ items: snapshot.data ?? [] });
      },
      (error) => {
        console.log(error);
      },
      query
    );

    return unsubscribe;
  }, [location, user?.id]);

  const listEmptyComponent = (
    <NoDataFound icon="" style={styles.noData} title="">
      <Text style={styles.noDataText}>
        {t("nearByItems.noItemsFoundText", {
          params: { city: location?.state?.name ?? location?.city?.name ?? "" },
        })}
      </Text>
    </NoDataFound>
  );

  const renderItem = ({ item }: any) => (
    <ItemCard showSwapIcon item={item as Item} sourceList="nearByItems" />
  );

  const onEndReached = useCallback(
    (info: any, length: number) => {
      if (length > 20) {
        router.navigate("/items");
      }
    },
    [router]
  );

  return itemsResponse ? (
    <View style={[styles.container, style]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t("nearByItems.title")}</Text>
        <Text style={styles.cityName}>({locText})</Text>
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
        // disableVirtualization
      />
    </View>
  ) : null;
};

export default React.memo(NearByItems);

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  cityName: {
    ...theme.styles.scale.h7,
    fontWeight: theme.fontWeight.bold,
  },
  changeCityContainer: {
    marginRight: 10,
  },
  changeCityLink: {
    // marginVertical: 10,
    ...theme.styles.scale.h6,
    flexWrap: "wrap",
  },
  card: {
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: 150,
    height: 200,
    padding: 10,
  },
  noData: {
    flex: 1,
    marginVertical: 10,
    // backgroundColor: 'grey',
  },
  noDataText: {
    ...theme.styles.scale.h6,
  },
});
