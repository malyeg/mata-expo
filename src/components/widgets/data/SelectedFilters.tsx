import categoriesApi from "@/api/categoriesApi";
import countriesApi from "@/api/countriesApi";
import { conditionList, Item, swapList } from "@/api/itemsApi";
import { Icon, Text } from "@/components/core";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Query } from "@/types/DataTypes";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface FilterLabelProps {
  query?: Query<Item>;
  onDelete?: (field: string) => void;
}
const SelectedFilters = ({ query, onDelete }: FilterLabelProps) => {
  const filters = query?.filters || [];
  const { locale } = useLocale();
  const deleteItem = (field: string) => {
    if (onDelete) {
      onDelete(field);
    }
  };

  // Extract filter values from the filters array
  const statesFilter = filters.find((f) => f.field === "stateId");
  const searchText = query?.searchText; // Search is stored in query.searchText, not filters
  const conditionTypesFilter = filters.find((f) => f.field === "conditionType");
  const categoryFilter = filters.find(
    (f) => f.field === "catLevel1,catLevel2,catLevel3"
  );
  if (categoryFilter) {
    const category = categoriesApi.getById(
      categoryFilter.id ?? categoryFilter.value
    );
    categoryFilter.name = category?.localizedName?.[locale] ?? category?.name;
  }

  // Get state names from IDs
  const getStateNames = (stateIds: string[]) => {
    const states = countriesApi.getStatesByIds(stateIds);
    return states.map((s) => s.name).join(", ");
  };
  const swapTypesFilter = filters.filter((f) => f.field === "swapOptionType");

  const swapOptionLabel = useMemo(() => {
    return swapTypesFilter
      .map((f) => {
        if (Array.isArray(f.value)) {
          return f.value
            .map((v) => {
              const swapOption = swapList.find((s) => s.id === v);
              return (
                swapOption?.localizedName?.[locale] ?? swapOption?.name ?? v
              );
            })
            .join(", ");
        }
        const swapOption = swapList.find((s) => s.id === f.value);
        return (
          swapOption?.localizedName?.[locale] ?? swapOption?.name ?? f.value
        );
      })
      .join(", ");
  }, [swapTypesFilter]);

  const conditionTypeLabel = useMemo(() => {
    if (!conditionTypesFilter) return "";
    let labels = [];
    if (Array.isArray(conditionTypesFilter.value)) {
      labels = conditionTypesFilter.value;
    } else {
      labels = [conditionTypesFilter.value];
    }
    return labels
      .map((v) => {
        const conditionType = conditionList.find((c) => c.id === v);
        return (
          conditionType?.localizedName?.[locale] ?? conditionType?.name ?? v
        );
      })
      .join(", ");
  }, [conditionTypesFilter]);

  return (
    <View style={styles.container}>
      {statesFilter &&
        Array.isArray(statesFilter.value) &&
        statesFilter.value.length > 0 && (
          <FilterComponent
            field="stateId"
            value={statesFilter.value.join(",")}
            label={getStateNames(statesFilter.value)}
            onDelete={deleteItem}
          />
        )}
      {searchText && (
        <FilterComponent
          field="searchInput"
          value={searchText}
          onDelete={deleteItem}
        />
      )}
      {conditionTypesFilter &&
        Array.isArray(conditionTypesFilter.value) &&
        conditionTypesFilter.value.length > 0 && (
          <FilterComponent
            field="conditionType"
            value={conditionTypesFilter.value.join(",")}
            label={conditionTypeLabel}
            onDelete={deleteItem}
          />
        )}
      {categoryFilter && categoryFilter.value && (
        <FilterComponent
          field="catLevel1,catLevel2,catLevel3"
          value={String(categoryFilter.value)}
          label={categoryFilter.name || String(categoryFilter.value)}
          onDelete={deleteItem}
        />
      )}
      {swapTypesFilter &&
        Array.isArray(swapTypesFilter) &&
        swapTypesFilter.length > 0 && (
          <FilterComponent
            field="swapOptionType"
            value={swapTypesFilter.map((f) => f.value).join(",")}
            label={swapOptionLabel}
            onDelete={deleteItem}
          />
        )}
    </View>
  );
};

const FilterComponent = (f: {
  field: string;
  value: string;
  label?: string;
  onDelete?: (field: string) => void;
}) => {
  const deleteFilter = () => {
    if (f?.onDelete) {
      f.onDelete(f.field);
    }
  };
  return (
    <Pressable style={styles.item} onPress={deleteFilter}>
      <Text style={styles.label} numberOfLines={1}>
        {f.label ?? f.value}
      </Text>
      {!!f?.onDelete && (
        <Icon
          name="close"
          style={styles.deleteIcon}
          size={15}
          color={theme.colors.salmon}
        />
      )}
    </Pressable>
  );
};

export default React.memo(SelectedFilters);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    marginLeft: 5,
    paddingVertical: 5,
    marginVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderColor: theme.colors.grey,
    borderWidth: 1,
  },
  label: {
    ...theme.styles.scale.body3,
    // textTransform: 'capitalize',
  },
  deleteIcon: {
    marginLeft: 2,
  },
});
