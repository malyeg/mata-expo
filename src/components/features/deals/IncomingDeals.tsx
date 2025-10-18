import { ApiResponse } from "@/api/Api";
import dealsApi, { Deal } from "@/api/dealsApi";
import itemsApi from "@/api/itemsApi";
import { IngoingDealsRoute } from "@/app/(main)/deals";
import { Image, Loader, Screen, Text } from "@/components/core";
import Badge from "@/components/core/Badge";
import Card from "@/components/core/Card";
import DataList from "@/components/widgets/DataList";
import DealStatus from "@/components/widgets/DealStatus";
import NoDataFound from "@/components/widgets/NoDataFound";
import { patterns, screens } from "@/config/constants";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";
import { Filter, Operation, QueryBuilder } from "@/types/DataTypes";
import { useRoute } from "@react-navigation/core";
import { Link } from "@react-navigation/native";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const IncomingDeals = () => {
  const [deals, setDeals] = useState<ApiResponse<Deal>>();
  const { loader } = useApi();
  const { t } = useLocale(screens.INCOMING_DEALS);
  const { user } = useAuth();
  const route = useRoute<IngoingDealsRoute>();
  const router = useRouter();
  useEffect(() => {
    const filters: Filter<Deal>[] = [{ field: "item.userId", value: user?.id }];
    if (route?.params?.archived === true) {
      filters.push({
        field: "status",
        operation: Operation.IN,
        value: ["closed", "rejected", "canceled"],
      });
    } else {
      filters.push({
        field: "status",
        operation: Operation.IN,
        value: ["new", "accepted"],
      });
    }
    const query = new QueryBuilder<Deal>()
      .filters(filters)
      .orderBy("timestamp", "desc")
      .build();
    return dealsApi.onQuerySnapshot(
      (snapshot) => {
        !!snapshot && setDeals({ items: snapshot.data });
      },
      (error) => {
        console.log(error);
      },
      query
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: { item: Deal }) => {
    const dealNewMessagesCount = item?.newMessages?.[user?.id!]?.length ?? 0;
    const onCardPress = () =>
      router.navigate({
        pathname: "/deals",
        params: { id: item.id },
      });
    return (
      <Card onPress={onCardPress}>
        <Image
          uri={itemsApi.getImageUrl(item?.item)}
          style={[styles.image]}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Text numberOfLines={1}>{item.item?.category?.name}</Text>
          {!!item.timestamp && (
            <Text style={styles.date}>
              {format(item.timestamp, patterns.DATE)}
            </Text>
          )}
          <DealStatus deal={item} style={styles.dealStatusText} />
        </View>
        <Badge count={dealNewMessagesCount} style={styles.badge} />
      </Card>
    );
  };

  const NoData = (
    <NoDataFound title={t("noData.body")}>
      <Link
        to={{ screen: screens.ITEMS, params: { action: "OPEN_FILTER" } }}
        style={[sharedStyles.link]}
      >
        <Text style={styles.noDataLink}>{t("noData.searchItemsLink")}</Text>
      </Link>
    </NoDataFound>
  );

  return (
    <Screen style={styles.screen}>
      {deals ? (
        <DataList
          containerStyle={styles.datalist}
          listStyle={styles.datalist}
          showsVerticalScrollIndicator={false}
          data={deals}
          // columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
          // itemSize={ITEM_CARD_HEIGHT}
          ListEmptyComponent={NoData}
        />
      ) : (
        <Loader />
      )}
      {loader}
    </Screen>
  );
};

export default IncomingDeals;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  datalist: { flex: 1 },
  separator: {
    height: 15,
  },
  image: {
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  content: {
    marginLeft: 10,
    flex: 1,
    // flexWrap: 'wrap',
    // flexDirection: 'row',
  },
  date: {
    color: theme.colors.grey,
    ...theme.styles.scale.body2,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dealStatusText: {
    marginRight: "auto",
    textTransform: "capitalize",
    minWidth: 100,
    textAlign: "center",

    marginTop: 5,
    // right: 0,
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  noDataLink: {
    marginTop: 10,
    color: theme.colors.salmon,
    ...theme.styles.scale.h5,
    // underline: {textDecorationLine: 'underline'},
    textDecorationLine: "underline",
  },
});
