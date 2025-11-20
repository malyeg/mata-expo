import countriesApi from "@/api/countriesApi";
import { Item } from "@/api/itemsApi";
import { Icon, Text } from "@/components/core";
import theme from "@/styles/theme";
import { Query } from "@/types/DataTypes";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface FilterLabelProps {
  query?: Query<Item>;
  onDelete?: (field: string) => void;
}
const SelectedFilters = ({ query, onDelete }: FilterLabelProps) => {
  const filters = query?.filters || [];

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
  const swapTypesFilter = filters.find((f) => f.field === "swapOptionType");

  // Get state names from IDs
  const getStateNames = (stateIds: string[]) => {
    const states = countriesApi.getStatesByIds(stateIds);
    return states.map((s) => s.name).join(", ");
  };

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
            label={
              conditionTypesFilter.name || conditionTypesFilter.value.join(", ")
            }
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
        Array.isArray(swapTypesFilter.value) &&
        swapTypesFilter.value.length > 0 && (
          <FilterComponent
            field="swapOptionType"
            value={swapTypesFilter.value.join(",")}
            label={swapTypesFilter.name || swapTypesFilter.value.join(", ")}
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
