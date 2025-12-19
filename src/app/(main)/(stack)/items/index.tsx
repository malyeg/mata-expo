import itemsApi, { Item } from "@/api/itemsApi";
import { Button, Icon, Loader, Modal, Screen, Text } from "@/components/core";
import ItemsFilter from "@/components/widgets/data/ItemsFilter";
import SelectedFilters from "@/components/widgets/data/SelectedFilters";
import FilterIcon from "@/components/widgets/FilterIcon";
import ItemsList from "@/components/widgets/ItemsList";
import ItemsMapView from "@/components/widgets/ItemsMapView";
import NoDataFound from "@/components/widgets/NoDataFound";
import { screens } from "@/config/constants";

import { useAlgoliaQuery } from "@/hooks/db/useAlgoliaQuery";
import useLocale from "@/hooks/useLocale";
import useToast from "@/hooks/useToast";
import useLocationStore from "@/store/location-store";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";
import { Query } from "@/types/DataTypes";
import { getQueryFromParams, ItemsParams } from "@/utils/ItemsSearchUtils";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const ItemsScreen = () => {
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isMapVisible, setMapVisible] = useState(false);
  const { showErrorToast, hideToast } = useToast();
  const { t } = useLocale(screens.ITEMS);
  const { t: tCommon } = useLocale("common");
  const params = useLocalSearchParams<ItemsParams>();
  const [query, setQuery] = useState<Query<Item> | undefined>();

  const {
    data,
    error,
    pagination: { hasMore, totalItems },
    loadMore,
    isFetching,
    refetch,
    isLoading,
  } = useAlgoliaQuery({
    indexName: itemsApi.collectionName,
    query: query,
    enabled: false,
  });

  console.log("query", data?.items?.[0]);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!params.countryId) {
      const countryId = useLocationStore.getState().location?.country?.id;
      params.countryId = countryId;
    }
    const newQuery = getQueryFromParams(params);
    setQuery(newQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.categoryId,
    params.conditionType,
    params.countryId,
    params.stateId,
    params.swapOptionType,
  ]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const pageTitle = useMemo(() => {
    if (totalItems && totalItems > 0 && !error) {
      return tCommon("screens.totalItems", { count: totalItems });
    }
    return tCommon("screens.items");
  }, [totalItems, error, tCommon]);

  const onFilterChange = async (newQuery: Query) => {
    hideToast();
    setQuery(newQuery);
    refetch();
  };

  const onFilterDelete = async (field: string) => {
    hideToast();
    if (field === "searchInput") {
      // searchText is stored separately from filters
      const newQuery = { ...query, searchText: undefined };
      setQuery(newQuery);
    } else {
      const newFilters = query?.filters?.filter((f) => f.field !== field);
      const newQuery = { ...query, filters: newFilters || [] };
      setQuery(newQuery);
    }
    refetch();
  };

  const closeFilterModal = () => setFilterVisible(true);

  const ListEmptyComponent = useMemo(
    () => (
      <NoDataFound>
        <Text>{t("noData.noDataFound")}</Text>
        <Button
          style={styles.changeButtonFilter}
          themeType="white"
          type="link"
          title={t("noData.changeFilterBtnTitle")}
          hitSlop={20}
          onPress={closeFilterModal}
        />
      </NoDataFound>
    ),
    [t]
  );

  const onCloseFilter = () => {
    setFilterVisible(false);
  };

  const mapLoadMore = () => {
    hasMore && loadMore();
  };

  const openFilter = () => {
    setFilterVisible(true);
  };

  const openMap = () => {
    setMapVisible(true);
  };

  const closeModal = () => setMapVisible(false);

  const keyExtractor = (item: Item) => item.objectID?.toString()!;

  if (isLoading || !data?.items) {
    return (
      <Screen scrollable={false} style={styles.screen}>
        <Stack.Screen
          options={{
            title: pageTitle,
          }}
        />
        <Loader />
      </Screen>
    );
  }

  return (
    <Screen scrollable={false} style={styles.screen}>
      <Stack.Screen
        options={{
          title: pageTitle,
        }}
      />
      <View style={styles.header}>
        {data.items && data.items.length > 0 && (
          <Pressable onPress={openMap} style={styles.viewMap}>
            <Icon
              name="map-marker-multiple-outline"
              color={theme.colors.dark}
              size={25}
              style={styles.mapIcon}
            />
            <Text style={sharedStyles.link}>{t("viewInMapLabel")}</Text>
          </Pressable>
        )}

        <FilterIcon onPress={openFilter} style={styles.filterIcon} />
        <ItemsFilter
          style={styles.filter}
          onChange={onFilterChange}
          defaultValues={query}
          openOnLoad={isFilterVisible}
          onClose={onCloseFilter}
        />
      </View>
      {query && <SelectedFilters query={query} onDelete={onFilterDelete} />}
      <ItemsList
        items={data.items}
        // onLoadMore={loadMore}
        moreLoading={hasMore && isFetching}
        sourceList="searchItems"
        // onRefresh={refreshData}
        onEndReached={() => {
          if (hasMore && !isFetching) {
            loadMore();
          }
        }}
        ListEmptyComponent={ListEmptyComponent}
        hasMore={hasMore}
        keyExtractor={keyExtractor}
      />

      <Modal
        isVisible={isMapVisible}
        position="full"
        title={pageTitle ?? ""}
        showHeaderNav
        bodyStyle={styles.modal}
        containerStyle={{
          paddingBottom: 0,
        }}
        onClose={closeModal}
      >
        <ItemsMapView
          items={data.items}
          onLoadMore={mapLoadMore}
          showLoadMore={hasMore}
          onSelectItem={closeModal}
        />
      </Modal>
    </Screen>
  );
};

export default React.memo(ItemsScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  modal: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  header: {
    // marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  filterIcon: {
    marginLeft: "auto",
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
  filter: {
    // marginLeft: 20,
  },

  changeButtonFilter: {
    marginVertical: 20,
    alignSelf: "stretch",
  },
  mapIcon: {
    marginRight: 10,
  },
  viewMap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
