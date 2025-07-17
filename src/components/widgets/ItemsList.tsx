import { Item } from "@/api/itemsApi";
import theme from "@/styles/theme";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import ItemCard, { ITEM_CARD_HEIGHT } from "./ItemCard";

interface ItemsListProps
  extends Omit<FlatListProps<Item>, "data" | "renderItem"> {
  items: Item[];
  onLoadMore?: () => Promise<void>;
  onRefresh?: () => void;
  hasMore?: boolean;
  moreLoading?: boolean;
  refreshing?: boolean;
  sourceList: "searchItems" | "filterItems" | "nearbyItems" | "mapItems";
  horizontal?: boolean;
  itemSize?: number;
  ListEmptyComponent?: FlatListProps<Item>["ListEmptyComponent"];
  cardType?: "default" | "map";
  onScroll?: FlatListProps<Item>["onScroll"];
}
const SEPARATOR_HEIGHT = 2;
const ITEM_HEIGHT = ITEM_CARD_HEIGHT + SEPARATOR_HEIGHT;

const ItemsList = ({
  items,
  sourceList,
  onLoadMore,
  hasMore,
  onRefresh,
  horizontal,
  moreLoading,
  refreshing = false,
  ListEmptyComponent,
  itemSize,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  onScroll,
  ...props
}: ItemsListProps) => {
  const renderItem = useCallback(
    ({ item }: { item: Item; index: number }) => {
      return (
        <ItemCard
          showSwapIcon
          style={styles.card}
          item={item}
          sourceList={sourceList}
        />
      );
    },
    [sourceList]
  );
  const listFooter = () => {
    return moreLoading ? (
      <View style={styles.footer}>
        <ActivityIndicator color={theme.colors.salmon} size="large" />
      </View>
    ) : null;
  };

  const loadMoreHandler = () => {
    if (hasMore && onLoadMore && !moreLoading) {
      onLoadMore();
    }
  };
  const getItemLayout = (data: Item[] | null | undefined, index: number) => {
    if (itemSize) {
      return {
        length: itemSize,
        offset: itemSize * index,
        index,
      };
    }
  };

  const verticalSeparator = () => <View style={styles.verticalSeparator} />;
  const horizontalSeparator = () => <View style={styles.horizontalSeparator} />;
  const keyExtractor = (item: Item) => item.id;

  return (
    <FlatList
      {...props}
      data={items}
      horizontal={horizontal}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      columnWrapperStyle={!horizontal ? styles.columnWrapper : undefined}
      contentContainerStyle={styles.contentContainer}
      getItemLayout={itemSize ? getItemLayout : undefined}
      numColumns={!horizontal ? 2 : undefined}
      onEndReachedThreshold={0.5}
      legacyImplementation={false}
      scrollEventThrottle={500}
      pagingEnabled={true}
      onEndReached={loadMoreHandler}
      ListFooterComponent={listFooter}
      ItemSeparatorComponent={
        props.ItemSeparatorComponent ??
        (horizontal ? horizontalSeparator : verticalSeparator)
      }
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={onScroll}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexBasis: "48%",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  contentContainer: {
    // flex: 1,
    paddingBottom: 20,
  },
  verticalSeparator: {
    height: SEPARATOR_HEIGHT,
  },
  horizontalSeparator: {
    width: SEPARATOR_HEIGHT,
  },
  footer: {
    // marginBottom: 10,
  },
  changeButtonFilter: {
    marginVertical: 20,
    alignSelf: "stretch",
  },
});

export default React.memo(ItemsList);
