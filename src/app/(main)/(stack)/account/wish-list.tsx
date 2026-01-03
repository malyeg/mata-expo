import { Item } from "@/api/itemsApi";
import listsApi from "@/api/listsApi";
import { Loader, Screen } from "@/components/core";
import DataList from "@/components/widgets/DataList";
import WishCard from "@/components/widgets/WishCard";
import { useFirestoreQuery } from "@/hooks/db/useFirestoreQuery";
import useAuth from "@/hooks/useAuth";
import { query, where } from "@react-native-firebase/firestore";
import React from "react";
import { StyleSheet } from "react-native";

const WishListScreen = () => {
  const { user } = useAuth();

  const { data, loading } = useFirestoreQuery<Item>(
    listsApi.collectionName,
    (ref) => {
      // Use modular query syntax
      return query(ref, where("user.id", "==", user?.id));
    }
  );

  // const { data, loading } = useFirestoreSnapshot({
  //   collectionName: listsApi.collectionName,
  //   query: QueryBuilder.from({
  //     filters: [{ field: "user.id", value: user?.id }],
  //   }),
  // });

  const renderItem = ({ item }: any) => (
    <WishCard listItem={item} style={styles.card} />
  );
  return (
    <Screen style={styles.screen}>
      {!loading && data ? (
        <DataList
          data={{ items: data }}
          renderItem={renderItem}
          // ListEmptyComponent={NoDataFound}
          // showsVerticalScrollIndicator={false}
        />
      ) : (
        <Loader />
      )}
    </Screen>
  );
};

export default WishListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
  },
});
