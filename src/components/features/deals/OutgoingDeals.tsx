import { ApiResponse } from "@/api/Api";
import categoriesApi from "@/api/categoriesApi";
import dealsApi, { Deal } from "@/api/dealsApi";
import itemsApi from "@/api/itemsApi";
import { OutgoingDealsRoute } from "@/app/(main)/deals";
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
import { useRoute } from "@react-navigation/core";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const OutgoingDeals = () => {
  const [deals, setDeals] = useState<ApiResponse<Deal>>();
  const route = useRoute<OutgoingDealsRoute>();
  const { loader } = useApi();
  const { user } = useAuth();
  const router = useRouter();
  const { t, locale } = useLocale(screens.OUTGOING_DEALS);

  useEffect(() => {
    const filters: Filter<Deal>[] = [{ field: "userId", value: user?.id }];
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
  }, [route?.params?.archived, user?.id]);

  const renderItem = ({ item }: { item: Deal }) => {
    const dealNewMessagesCount = item?.newMessages?.[user?.id!]?.length ?? 0;
    const categoryName = categoriesApi.getById(item.item?.category?.id)
      ?.localizedName?.[locale];
    const onImagePress = () => {
      console.log("Navigating to deal id:", item.id);
      router.navigate({
        pathname: "/deals/[id]",
        params: { id: item.id },
      });
    };
    return (
      <Card onPress={onImagePress}>
        <Image
          uri={itemsApi.getImageUrl(item.item)}
          style={[styles.image]}
          resizeMode="contain"
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
        href={{
          pathname: "/(main)/items",
          params: { action: "OPEN_FILTER" },
        }}
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

export default OutgoingDeals;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  datalist: { flex: 1 },
  separator: {
    height: 15,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    // position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  content: {
    marginLeft: 10,
    gap: 5,
    // flex: 1,
  },
  date: {
    color: theme.colors.grey,
    ...theme.styles.scale.body2,
  },
  dealStatusText: {
    // marginRight: "auto",
    minWidth: 100,
    textAlign: "center",
    marginTop: 5,
  },
  noDataLink: {
    marginTop: 10,
    color: theme.colors.salmon,
    ...theme.styles.scale.h5,
    // underline: {textDecorationLine: 'underline'},
    textDecorationLine: "underline",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
  },
});
