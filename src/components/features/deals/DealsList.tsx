import { ApiResponse } from "@/api/Api";
import categoriesApi from "@/api/categoriesApi";
import dealsApi, { Deal } from "@/api/dealsApi";
import itemsApi from "@/api/itemsApi";
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
import { formatDate } from "@/utils/DateUtils";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export type DealsListType = "incoming" | "outgoing";

interface DealsListProps {
  type: DealsListType;
  archived?: boolean;
}

const DealsList = ({ type, archived = false }: DealsListProps) => {
  const [deals, setDeals] = useState<ApiResponse<Deal>>();
  const { loader } = useApi();
  const { user } = useAuth();
  const router = useRouter();

  const screenKey =
    type === "incoming" ? screens.INCOMING_DEALS : screens.OUTGOING_DEALS;
  const { t, locale } = useLocale(screenKey);

  useEffect(() => {
    // Incoming deals filter by item owner, outgoing by deal creator
    const userFilterField = type === "incoming" ? "item.userId" : "userId";
    const filters: Filter<Deal>[] = [
      { field: userFilterField, value: user?.id },
    ];

    if (archived) {
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
  }, [type, archived, user?.id]);

  const renderItem = ({ item }: { item: Deal }) => {
    const dealNewMessagesCount = item?.newMessages?.[user?.id!]?.length ?? 0;
    const categoryName = categoriesApi.getById(item.item?.category?.id)
      ?.localizedName?.[locale];

    const onCardPress = () => {
      router.navigate({
        pathname: "/deals/[id]",
        params: { id: item.id },
      });
    };

    return (
      <Card onPress={onCardPress} style={styles.card}>
        <Image
          uri={itemsApi.getImageUrl(item?.item)}
          style={styles.image}
          contentFit="contain"
        />
        <View style={styles.content}>
          <Text numberOfLines={1}>{categoryName}</Text>
          {!!item.timestamp && (
            <Text style={styles.date}>
              {formatDate(item.timestamp, patterns.DATE)}
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
        href={{ pathname: "/(main)/items", params: { action: "OPEN_FILTER" } }}
        style={sharedStyles.link}
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
          renderItem={renderItem}
          ListEmptyComponent={NoData}
        />
      ) : (
        <Loader />
      )}
      {loader}
    </Screen>
  );
};

export { DealsList };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: theme.colors.white,
  },
  datalist: {
    flex: 1,
  },
  card: {
    gap: 10,
  },
  image: {
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
  },
  content: {
    alignItems: "flex-start",
    gap: 5,
    // marginLeft: 10,
    // flex: 1,
  },
  date: {
    color: theme.colors.grey,
    ...theme.styles.scale.body2,
  },
  dealStatusText: {
    marginRight: "auto",
    textTransform: "capitalize",
    minWidth: 100,
    textAlign: "center",
    marginTop: 5,
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
    textDecorationLine: "underline",
  },
});
