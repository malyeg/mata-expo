import { useAlgoliaQuery } from "@/hooks/db/useAlgoliaQuery";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type Item = {
  objectID: string;
  name: string;
  description: string;
  category: string;
};
const ItemsSearch = () => {
  const { user } = useAuth();
  const { data, isLoading, isFetching, error, pagination, loadMore } =
    useAlgoliaQuery<Item[]>({
      indexName: "items",
      query: {
        filters: `NOT userUid:"${user.id}"`,
        // searchText: "blue",
      },
      pagination: {
        itemsPerPage: 10,
      },
      select: (result) => result.hits,
    });

  const renderItem = ({ item }: { item: Item }) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View>
      <Text>Items Search</Text>
      {isLoading || (isFetching && <Text>Loading...</Text>)}
      {error && <Text>Error: {error.message}</Text>}
      <Button title="LoadMore" onPress={() => loadMore()} />
      {/* {data && (
        <View>
          <FlatList
            data={data}
            renderItem={renderItem}
            onEndReached={() => {
              if (pagination.hasMore && !isFetching) {
                loadMore();
              }
            }}
            ListFooterComponent={
              pagination.hasMore && isFetching ? (
                <ActivityIndicator />
              ) : pagination.hasMore ? (
                <Text>Pull to load more</Text>
              ) : (
                <Text>No more results</Text>
              )
            }
          />
        </View>
      )} */}
    </View>
  );
};

export default ItemsSearch;

const styles = StyleSheet.create({});
