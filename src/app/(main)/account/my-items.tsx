import itemsApi, { Item } from "@/api/itemsApi";
import { Loader, Screen, Text } from "@/components/core";
import DataList from "@/components/widgets/DataList";
import ItemCard, { ITEM_CARD_HEIGHT } from "@/components/widgets/ItemCard";
import NoDataFound from "@/components/widgets/NoDataFound";
import { screens } from "@/config/constants";
import { useFirestoreQuery } from "@/hooks/db/useFirestoreQuery";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";
import { Link } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";

const MyItemsScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data: items, loading } = useFirestoreQuery<Item>(
    itemsApi.collectionName,
    (ref) => {
      return ref
        .where("user.id", "==", user?.id)
        .where("status", "==", "online");
    }
  );

  // const { data, loading } = useFirestoreSnapshot({
  //   collectionName: itemsApi.collectionName,
  //   query: QueryBuilder.from({
  //     filters: [{ field: "userId", value: user?.id }],
  //   }),
  // });
  const { t } = useLocale(screens.MY_ITEMS);

  useEffect(() => {
    const menuItems = [
      {
        label: t("menu.archivedLabel"),
        onPress: () => {
          router.navigate("/profile/archived-items");
        },
      },
    ];
    // TODO fix menu items
    // (navigation as any).setOptions({
    //   header: (props: any) => <Header {...props} menu={{ items: menuItems }} />,
    // });
  }, [router, t]);

  const renderItem = ({ item }: any) => (
    <ItemCard style={styles.card} item={item as Item} showActivityStatus />
  );
  const NoData = (
    <NoDataFound style={styles.card} title={t("noData.title")}>
      <Link to={{ screen: screens.ADD_ITEM }} style={[sharedStyles.link]}>
        <Text style={styles.noDataLink}>Add new Item</Text>
      </Link>
    </NoDataFound>
  );

  const listData = useMemo(
    () => ({
      items: items?.filter((i: Item) => i.status !== "archived") ?? [],
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

export default React.memo(MyItemsScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  datalist: { flex: 1 },
  categories: {
    marginVertical: 20,
  },
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
  addIcon: {
    marginRight: 5,
  },
});
