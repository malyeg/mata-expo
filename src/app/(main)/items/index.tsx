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
import useLocale from "@/hooks/useLocale";
import useLocation from "@/hooks/useLocation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import useToast from "@/hooks/useToast";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { Filter, Operation, Query, QueryBuilder } from "@/types/DataTypes";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type ItemsRoute = RouteProp<StackParams, typeof screens.ITEMS>;
const ItemsScreen = () => {
  const { location } = useLocation();
  const route = useRoute<ItemsRoute>();
  const [filters, setFilters] = useState<ItemsFilterForm>();
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isMapVisible, setMapVisible] = useState(false);
  const { showErrorToast, hideToast } = useToast();
  const { t } = useLocale(screens.ITEMS);
  const navigation = useNavigation();

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
    items,
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

  useEffect(() => {
    const queryBuilder = QueryBuilder.fromQuery<Item>(baseQuery);
    queryBuilder.location({
      coordinate: location?.coordinate!,
      aroundRadius: "all",
    });
    const filtersForm = getFilterFormFromRoute(route);
    filtersForm.country = location?.country;

    queryBuilder.addToFilters(toQueryFilter(filtersForm));
    !!filtersForm.searchInput &&
      queryBuilder.searchText(filtersForm.searchInput);
    const query = queryBuilder.build();
    setFilters(filtersForm);

    if (route?.params?.action === "OPEN_FILTER") {
      setFilterVisible(true);
    }
    console.log("updatedFilters", query.searchText, filtersForm.searchInput);
    loadData(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, route]);

  useEffect(() => {
    const updateTitle = page?.totalDocs && page.totalDocs > 0 && !error;

    navigation.setOptions({
      headerTitle: updateTitle ? `${page.totalDocs} items` : "Search Items",
    });
  }, [page, navigation, error]);

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
      {items && (
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
      )}
      {items && (
        <Modal
          isVisible={isMapVisible}
          position="full"
          title={page?.totalDocs + " Items"}
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

const getFilterFormFromRoute = (route: ItemsRoute) => {
  const params = route.params;
  const filters: ItemsFilterForm = route?.params?.filters ?? {};

  !!params?.category && (filters.category = params.category);
  !!params?.conditionType &&
    (filters.conditionTypes = conditionList.filter(
      (c) => c.id === params.conditionType.toString()
    ));
  !!params?.country && (filters.country = params.country);
  !!params?.state && (filters.states = [params.state]);
  !!params?.swapType &&
    (filters.swapTypes = swapList.filter(
      (c) => c.id === params.swapType.toString()
    ));

  return filters;
};
