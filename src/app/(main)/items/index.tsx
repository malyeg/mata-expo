import { Category } from "@/api/categoriesApi";
import itemsApi, { conditionList, Item, swapList } from "@/api/itemsApi";
import { Button, Icon, Loader, Modal, Screen, Text } from "@/components/core";
import ItemsFilter, {
  ItemsFilterForm,
} from "@/components/widgets/data/ItemsFilter";
import SelectedFilters from "@/components/widgets/data/SelectedFilters";
import FilterIcon from "@/components/widgets/FilterIcon";
import ItemsList from "@/components/widgets/ItemsList";
import ItemsMapView from "@/components/widgets/ItemsMapView";
import NoDataFound from "@/components/widgets/NoDataFound";
import { screens } from "@/config/constants";
import { useSearchQuery } from "@/hooks/db/useSearchQuery";
import useLocale from "@/hooks/useLocale";
import useLocation from "@/hooks/useLocation";
import useToast from "@/hooks/useToast";
import { Country, State } from "@/models/place.model";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { Filter, Operation, Query, QueryBuilder } from "@/types/DataTypes";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type ItemsParams = {
  id?: string;
  action?: "OPEN_FILTER";
  category?: string;
  country?: string;
  state?: string;
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
  const params = useLocalSearchParams<ItemsParams>();

  const baseQuery: Partial<Query> = {
    filters: [
      // {field: 'userId', value: user.id, operation: Operation.NOT_EQUAL},
    ],
    page: {
      index: 0,
      size: 50,
    },
  };

  const {
    data: items,
    page,
    initialLoading,
    moreLoading,
    error,
    loadData,
    refreshData,
    isRefreshing,
    loadMore,
    hasMore,
  } = useSearchQuery<Item>({
    collectionName: itemsApi.collectionName,
  });

  console.log("items pages", page?.totalDocs);

  !!error && showErrorToast(error);

  useEffect(() => {
    const queryBuilder = QueryBuilder.fromQuery<Item>(baseQuery);
    queryBuilder.location({
      coordinate: location?.coordinate!,
      aroundRadius: "all",
    });
    const filtersForm = getFilterFormFromParams(params);
    filtersForm.country = location?.country;

    queryBuilder.addToFilters(toQueryFilter(filtersForm));
    !!filtersForm.searchInput &&
      queryBuilder.searchText(filtersForm.searchInput);
    const query = queryBuilder.build();
    setFilters(filtersForm);

    if (params?.action === "OPEN_FILTER") {
      setFilterVisible(true);
    }
    console.log("updatedFilters", query.searchText, filtersForm.searchInput);
    loadData(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const pageTitle = useMemo(() => {
    if (page?.totalDocs && page.totalDocs > 0 && !error) {
      return `${page.totalDocs} ${t("items")}`;
    }
    return t("searchItems");
  }, [page, error, t]);

  const onFilterChange = async (updatedFilters?: ItemsFilterForm) => {
    hideToast();
    const queryBuilder = QueryBuilder.fromQuery<Item>(baseQuery);
    queryBuilder
      .location({
        coordinate: location?.coordinate!,
        aroundRadius: "all",
      })
      .searchText(updatedFilters?.searchInput)
      .addToFilters(toQueryFilter(updatedFilters!));

    setFilters(updatedFilters);

    const query = queryBuilder.build();

    await loadData(query);
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

  return (
    <Screen scrollable={false} style={styles.screen}>
      <Stack.Screen
        options={{
          title: pageTitle,
        }}
      />
      <View style={styles.header}>
        {!!filters?.country && items && items?.length > 0 && (
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
        {filters && (
          <ItemsFilter
            style={styles.filter}
            onChange={onFilterChange}
            defaultValues={filters}
            openOnLoad={isFilterVisible}
            onClose={onCloseFilter}
          />
        )}
      </View>
      {!!filters && (
        <SelectedFilters filters={filters} onDelete={onFilterChange} />
      )}
      <ItemsList
        items={items}
        onLoadMore={loadMore}
        moreLoading={moreLoading}
        sourceList="searchItems"
        onRefresh={refreshData}
        ListEmptyComponent={ListEmptyComponent}
        refreshing={isRefreshing}
        hasMore={hasMore}
      />

      {items && (
        <Modal
          isVisible={isMapVisible}
          position="full"
          title={page?.totalPages + " Items"}
          showHeaderNav
          bodyStyle={styles.modal}
          // containerStyle={styles.modal}
          onClose={closeModal}
        >
          <ItemsMapView
            items={items}
            onLoadMore={mapLoadMore}
            showLoadMore={hasMore}
            onSelectItem={closeModal}
          />
        </Modal>
      )}
      {initialLoading && <Loader />}
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

const getFilterFormFromParams = (params: ItemsParams) => {
  const filters: ItemsFilterForm = {};

  !!params?.category &&
    (filters.category = JSON.parse(params.category) as Category);
  !!params?.conditionType &&
    (filters.conditionTypes = conditionList.filter(
      (c) => c.id === params.conditionType?.toString()
    ));
  !!params?.country &&
    (filters.country = JSON.parse(params.country) as Country);
  !!params?.state && (filters.states = [JSON.parse(params.state) as State]);
  !!params?.swapType &&
    (filters.swapTypes = swapList.filter(
      (c) => c.id === params.swapType?.toString()
    ));

  return filters;
};
