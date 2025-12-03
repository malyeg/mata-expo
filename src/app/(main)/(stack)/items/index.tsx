import { Category } from "@/api/categoriesApi";
import itemsApi, { Item, swapList } from "@/api/itemsApi";
import { Button, Icon, Loader, Modal, Screen, Text } from "@/components/core";
import ItemsFilter from "@/components/widgets/data/ItemsFilter";
import SelectedFilters from "@/components/widgets/data/SelectedFilters";
import FilterIcon from "@/components/widgets/FilterIcon";
import ItemsList from "@/components/widgets/ItemsList";
import ItemsMapView from "@/components/widgets/ItemsMapView";
import NoDataFound from "@/components/widgets/NoDataFound";
import { screens } from "@/config/constants";
import categories from "@/data/categories";
import { useAlgoliaQuery } from "@/hooks/db/useAlgoliaQuery";
import useLocale from "@/hooks/useLocale";
import useToast from "@/hooks/useToast";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";
import { Operation, Query } from "@/types/DataTypes";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type ItemsParams = {
  id?: string;
  action?: "OPEN_FILTER";
  categoryId?: string;
  countryId?: string;
  stateId?: string;
  swapType?: string;
  conditionType?: string;
  // filters?: ItemsFilterForm;
};

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
    pagination: { hasMore, totalPages, totalItems },
    loadMore,
    isFetching,
    refetch,
    isLoading,
  } = useAlgoliaQuery({
    indexName: itemsApi.collectionName,
    query: query,
    enabled: false,
  });

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    const newQuery = getQueryFromParams(params);
    setQuery(newQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.categoryId,
    params.conditionType,
    params.countryId,
    params.stateId,
    params.swapType,
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

// const toQueryFilter = (filtersForm: ItemsFilterForm) => {
//   const newFilters: Filter[] = [];
//   !!filtersForm.country &&
//     newFilters.push({
//       name: "countryId",
//       field: "location.country.id",
//       value: filtersForm?.country.id,
//     });
//   !!filtersForm.states &&
//     newFilters.push({
//       field: "stateId",
//       operation: Operation.IN,
//       value: filtersForm?.states.map((s) => s.id.toString()),
//     });

//   !!filtersForm.category &&
//     newFilters.push({
//       field: "catLevel1,catLevel2,catLevel3",
//       value: filtersForm.category.name,
//     });

//   !!filtersForm.swapTypes &&
//     newFilters.push({
//       field: "swapOptionType",
//       operation: Operation.IN,
//       value: filtersForm.swapTypes.map((s) => s.id),
//     });
//   !!filtersForm.conditionTypes &&
//     newFilters.push({
//       field: "conditionType",
//       operation: Operation.IN,
//       value: filtersForm.conditionTypes.map((s) => s.id),
//     });
//   !!filtersForm.swapCategory &&
//     newFilters.push({
//       field: "swapCategory",
//       value: filtersForm.swapCategory.name,
//     });

//   return newFilters;
// };

const getQueryFromParams = (params: ItemsParams) => {
  const query: Query = { filters: [] };

  if (params.categoryId) {
    const category = categories.find(
      (c) => c.id === params.categoryId
    ) as Category;

    query.filters?.push({
      id: category.id,
      field: "catLevel1,catLevel2,catLevel3",
      value: category.name,
      operation: Operation.EQUAL,
    });
  }

  if (params?.conditionType) {
    query.filters?.push({
      field: "conditionType",
      value: params.conditionType,
      operation: Operation.EQUAL,
    });
  }

  if (params.countryId) {
    query.filters?.push({
      field: "countryId",
      value: params.countryId,
      operation: Operation.EQUAL,
    });
  }

  if (params?.stateId) {
    query.filters?.push({
      field: "location.state.id",
      value: JSON.parse(params.stateId)?.id,
      operation: Operation.EQUAL,
    });
  }
  if (params?.swapType) {
    const swapType = swapList.filter(
      (c) => c.id === params.swapType?.toString()
    );
    query.filters?.push({
      field: "swapOptionType",
      value: swapType[0].id,
      operation: Operation.EQUAL,
    });
  }

  return query;
};
