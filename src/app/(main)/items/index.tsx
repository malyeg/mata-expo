import { Category } from "@/api/categoriesApi";
import countriesApi from "@/api/countriesApi";
import itemsApi, { Item, swapList } from "@/api/itemsApi";
import { Button, Text } from "@/components/core";
import { ItemsFilterForm } from "@/components/widgets/data/ItemsFilter";
import NoDataFound from "@/components/widgets/NoDataFound";
import { screens } from "@/config/constants";
import categories from "@/data/categories";
import { useAlgoliaQuery } from "@/hooks/db/useAlgoliaQuery";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import useLocation from "@/hooks/useLocation";
import useToast from "@/hooks/useToast";
import { Filter, Operation, Query, QueryBuilder } from "@/types/DataTypes";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

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
  const { location } = useLocation();
  const [filters, setFilters] = useState<ItemsFilterForm>();
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isMapVisible, setMapVisible] = useState(false);
  const { showErrorToast, hideToast } = useToast();
  const { t } = useLocale(screens.ITEMS);
  const { user } = useAuth();
  const params = useLocalSearchParams<ItemsParams>();

  console.log("ItemsScreen params", params.categoryId);
  const [query, setQuery] = useState<Partial<Query | undefined>>();

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
    const query = getQueryFromParams(params);
    console.log("Setting query from params", query);
    // setQuery(query);
  }, [params]);

  // useEffect(() => {
  //   refetch();
  // }, [query]);

  const pageTitle = useMemo(() => {
    if (totalItems && totalItems > 0 && !error) {
      return `${totalItems} ${t("items")}`;
    }
    return "Search Items";
  }, [totalItems, error, t]);

  const onFilterChange = async (updatedFilters?: ItemsFilterForm) => {
    hideToast();
    console.log("onFilterChange", updatedFilters);
    const queryBuilder = QueryBuilder.fromQuery<Item>(query);
    queryBuilder
      .location({
        coordinate: location?.coordinate!,
        aroundRadius: "all",
      })
      .searchText(updatedFilters?.searchInput)
      .addToFilters(toQueryFilter(updatedFilters!));

    setFilters(updatedFilters);

    const updatedQuery = queryBuilder.build();

    // await fetch(updatedQuery);
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
  console.log("ItemsScreen render");

  return null;

  // return (
  //   <Screen scrollable={false} style={styles.screen}>
  //     <Stack.Screen
  //       options={{
  //         title: pageTitle,
  //       }}
  //     />
  //     <View style={styles.header}>
  //       {!!filters?.country && items && items?.length > 0 && (
  //         <Pressable onPress={openMap} style={styles.viewMap}>
  //           <Icon
  //             name="map-marker-multiple-outline"
  //             color={theme.colors.dark}
  //             size={25}
  //             style={styles.mapIcon}
  //           />
  //           <Text style={sharedStyles.link}>{t("viewInMapLabel")}</Text>
  //         </Pressable>
  //       )}

  //       <FilterIcon onPress={openFilter} style={styles.filterIcon} />
  //       {filters && (
  //         <ItemsFilter
  //           style={styles.filter}
  //           onChange={onFilterChange}
  //           defaultValues={filters}
  //           openOnLoad={isFilterVisible}
  //           onClose={onCloseFilter}
  //         />
  //       )}
  //     </View>
  //     {!!filters && (
  //       <SelectedFilters filters={filters} onDelete={onFilterChange} />
  //     )}
  //     <ItemsList
  //       items={items}
  //       // onLoadMore={loadMore}
  //       moreLoading={hasMore && isFetching}
  //       sourceList="searchItems"
  //       // onRefresh={refreshData}
  //       onEndReached={() => {
  //         if (hasMore && !isFetching) {
  //           loadMore();
  //         }
  //       }}
  //       ListEmptyComponent={ListEmptyComponent}
  //       // refreshing={isRefreshing}
  //       hasMore={hasMore}
  //     />

  //     {items && (
  //       <Modal
  //         isVisible={isMapVisible}
  //         position="full"
  //         title={totalItems + " Items"}
  //         showHeaderNav
  //         bodyStyle={styles.modal}
  //         // containerStyle={styles.modal}
  //         onClose={closeModal}
  //       >
  //         <ItemsMapView
  //           items={items}
  //           onLoadMore={mapLoadMore}
  //           showLoadMore={hasMore}
  //           onSelectItem={closeModal}
  //         />
  //       </Modal>
  //     )}
  //     {isLoading && <Loader />}
  //   </Screen>
  // );
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

const toQueryFilter = (filtersForm: ItemsFilterForm) => {
  const newFilters: Filter[] = [];
  !!filtersForm.country &&
    newFilters.push({
      name: "countryId",
      field: "location.country.id",
      value: filtersForm?.country.id,
    });
  !!filtersForm.states &&
    newFilters.push({
      field: "stateId",
      operation: Operation.IN,
      value: filtersForm?.states.map((s) => s.id.toString()),
    });

  !!filtersForm.category &&
    newFilters.push({
      field: "catLevel1,catLevel2,catLevel3",
      value: filtersForm.category.name,
    });

  !!filtersForm.swapTypes &&
    newFilters.push({
      field: "swapOptionType",
      operation: Operation.IN,
      value: filtersForm.swapTypes.map((s) => s.id),
    });
  !!filtersForm.conditionTypes &&
    newFilters.push({
      field: "conditionType",
      operation: Operation.IN,
      value: filtersForm.conditionTypes.map((s) => s.id),
    });
  !!filtersForm.swapCategory &&
    newFilters.push({
      field: "swapCategory",
      value: filtersForm.swapCategory.name,
    });

  return newFilters;
};

const getQueryFromParams = (params: ItemsParams) => {
  const query: Query = {};

  if (params.categoryId) {
    const category = categories.find(
      (c) => c.id === params.categoryId
    ) as Category;
    query.filters?.push({
      field: "category.id",
      value: category.id,
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
    const country = countriesApi
      .getAll()
      .find((c) => c.id === params.countryId);
    query.filters?.push({
      field: "location.country.id",
      value: country?.id,
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
