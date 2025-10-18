import { Icon, Text } from "@/components/core";
import theme from "@/styles/theme";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ItemsFilterForm } from "./ItemsFilter";

interface FilterLabelProps {
  filters: ItemsFilterForm;
  onDelete?: (filters: ItemsFilterForm) => void;
}
const SelectedFilters = ({ filters, onDelete }: FilterLabelProps) => {
  // const swapTypes = filters.swapTypes
  //   ? swapList.find(s => filters.swapTypes?.includes(s.id))?.name
  //   : undefined;

  const deleteItem = (field: keyof ItemsFilterForm) => {
    if (onDelete) {
      const updatedFilters = { ...filters };
      delete updatedFilters[field];
      if (field === "swapTypes") {
        delete updatedFilters.swapCategory;
      }
      onDelete(updatedFilters);
    }
  };
  return (
    <View style={styles.container}>
      {filters.states && filters.states.length > 0 && (
        <FilterComponent
          field="states"
          value={filters.states.map((s) => s.id).join(",")}
          label={filters.states.map((s) => s.name).join(", ")}
          onDelete={deleteItem}
        />
      )}
      {filters.searchInput && (
        <FilterComponent
          field="searchInput"
          value={filters.searchInput}
          onDelete={deleteItem}
        />
      )}
      {filters.conditionTypes && filters.conditionTypes.length > 0 && (
        <FilterComponent
          field="conditionTypes"
          value={filters.conditionTypes.map((s) => s.id).join(",")}
          label={filters.conditionTypes.map((s) => s.name).join(", ")}
          onDelete={deleteItem}
        />
      )}
      {filters.category && (
        <FilterComponent
          field="category"
          value={filters.category.id}
          label={filters.category.name}
          onDelete={deleteItem}
        />
      )}
      {filters.swapTypes && filters.swapTypes.length > 0 && (
        <FilterComponent
          field="swapTypes"
          value={filters.swapTypes.map((s) => s.id).join(",")}
          label={filters.swapTypes.map((s) => s.name).join(", ")}
          onDelete={deleteItem}
        />
      )}
      {/* {filters.swapTypes && swapType && (
        <FilterComponent
          field="swapType"
          value={swapType}
          onDelete={deleteItem}
        />
      )} */}
    </View>
  );
};

const FilterComponent = (f: {
  field: keyof ItemsFilterForm;
  value: string;
  label?: string;
  onDelete?: (field: keyof ItemsFilterForm) => void;
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
