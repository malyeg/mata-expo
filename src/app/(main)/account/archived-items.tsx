import itemsApi, { Item, ItemStatus } from "@/api/itemsApi";
import { Loader, Screen, Text } from "@/components/core";
import DataList from "@/components/widgets/DataList";
import ItemCard, { ITEM_CARD_HEIGHT } from "@/components/widgets/ItemCard";
import NoDataFound from "@/components/widgets/NoDataFound";
import { screens } from "@/config/constants";
import { useFirestoreSnapshot } from "@/hooks/db/useFirestoreSnapshot";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { QueryBuilder } from "@/types/DataTypes";
import { Link } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";

const MyArchivedItemsScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading } = useFirestoreSnapshot({
    collectionName: itemsApi.collectionName,
    query: QueryBuilder.from({
      filters: [
        { field: "userId", value: user?.id },
        { field: "status", value: "archived" as ItemStatus },
      ],
    }),
  });
  const { t } = useLocale(screens.MY_ITEMS);

  useEffect(() => {
    const menuItems = [
      {
        label: t("menu.itemsLabel"),
        onPress: () => {
          router.navigate("/account/my-items");
        },
      },
    ];

    // TODO fix menu items
    // (navigation as any).setOptions({
    //   header: (props: any) => <Header {...props} menu={{items: menuItems}} />,
    // });
  }, [router, t]);

  const renderItem = ({ item }: any) => (
    <ItemCard style={styles.card} item={item as Item} showActivityStatus />
  );
  const NoData = (
    <NoDataFound style={styles.card}>
      <Link to={{ screen: screens.ADD_ITEM }} style={[sharedStyles.link]}>
        <Text style={styles.noDataLink}>Add new Item</Text>
      </Link>
    </NoDataFound>
  );

  const listData = useMemo(
    () => ({
      items: data,
    }),
    [data]
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

export default React.memo(MyArchivedItemsScreen);

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
    // underline: {textDecorationLine: 'underline'},
    textDecorationLine: "underline",
  },
});
