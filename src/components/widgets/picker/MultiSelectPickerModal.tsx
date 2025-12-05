import { Button, Modal } from "@/components/core";
import SearchInput from "@/components/form/SearchInput";
import useLocale from "@/hooks/useLocale";
import { usePickerSearch } from "@/hooks/usePickerSearch";
import { Entity } from "@/types/DataTypes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, FlatListProps, StyleSheet, View } from "react-native";
import NoDataFound from "../NoDataFound";
import { multiSelectStyles, pickerStyles } from "./pickerStyles";
import SelectablePickerItem from "./SelectablePickerItem";

export interface MultiSelectPickerModalProps<T extends Entity> {
  items: T[];
  isModalVisible: boolean;
  onCloseModal: () => void;
  onSelectItems: (items: T[]) => void;
  headerTitle?: string;
  defaultValues?: string[];
  searchPlaceholder?: string;
  searchable?: boolean;
  keyboardShouldPersistTaps?: FlatListProps<Entity>["keyboardShouldPersistTaps"];
}

const MultiSelectPickerModal = <T extends Entity>({
  items,
  isModalVisible,
  headerTitle,
  defaultValues,
  searchable,
  searchPlaceholder,
  onSelectItems,
  onCloseModal,
  keyboardShouldPersistTaps,
}: MultiSelectPickerModalProps<T>) => {
  const { t, locale } = useLocale("common");
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const { searchText, filteredItems, setSearchText, clearSearch } =
    usePickerSearch({
      items,
      debounceMs: 400,
    });

  // Initialize selected items from defaultValues
  useEffect(() => {
    if (defaultValues) {
      const newSelectedItems = items.filter((i) =>
        defaultValues.includes(i.id)
      );
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems([]);
    }
  }, [defaultValues, items]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isModalVisible) {
      clearSearch();
    }
  }, [isModalVisible, clearSearch]);

  const updateItems = useCallback((item: T, selected: boolean) => {
    setSelectedItems((currentItems) => {
      if (selected) {
        return [...currentItems, item];
      }
      return currentItems.filter((i) => i.id !== item.id);
    });
  }, []);

  const handleItemChange = useCallback(
    (item: T, selected: boolean) => {
      updateItems(item, selected);
    },
    [updateItems]
  );

  const renderItemHandler = useCallback(
    ({ item }: { item: T }) => {
      const isSelected = selectedItems.some((i) => i.id === item.id);
      return (
        <SelectablePickerItem
          item={item}
          onChange={handleItemChange}
          label={item.localizedName?.[locale] ?? item.name ?? item.id}
          selected={isSelected}
        />
      );
    },
    [selectedItems, handleItemChange, locale]
  );

  const listEmptyComponent = useCallback(
    () => <NoDataFound style={pickerStyles.noData} />,
    []
  );

  const separatorComponent = useCallback(
    () => <View style={pickerStyles.separator} />,
    []
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<T> | null | undefined, index: number) => ({
      length: 60,
      offset: 60 * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: T) => item.id, []);

  const submit = useCallback(() => {
    onSelectItems(selectedItems);
  }, [onSelectItems, selectedItems]);

  const onSelectAllChange = useCallback(
    (_item: Entity, selected: boolean) => {
      if (selected) {
        setSelectedItems([...items]);
      } else {
        setSelectedItems([]);
      }
    },
    [items]
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && items.length === selectedItems.length,
    [items.length, selectedItems.length]
  );

  const contentContainerStyle = useMemo(
    () => (filteredItems.length === 0 ? pickerStyles.noData : undefined),
    [filteredItems.length]
  );

  if (!isModalVisible) {
    return null;
  }

  return (
    <Modal
      style={pickerStyles.modal}
      isVisible={isModalVisible}
      swipeDirection={["down"]}
      onClose={onCloseModal}
      title={headerTitle}
      showHeaderNav
      position="full"
      propagateSwipe
    >
      {searchable && (
        <SearchInput
          style={pickerStyles.searchInput}
          value={searchText}
          placeholder={searchPlaceholder ?? t("picker.searchPlaceholder")}
          onChangeText={setSearchText}
        />
      )}
      {!searchText && (
        <SelectablePickerItem
          style={multiSelectStyles.selectAll}
          item={{ id: "-1", name: "all" }}
          label={t("picker.selectAll")}
          onChange={onSelectAllChange}
          labelStyle={multiSelectStyles.allLabel}
          selected={isAllSelected}
        />
      )}
      <FlatList
        data={filteredItems as T[]}
        showsVerticalScrollIndicator={false}
        renderItem={renderItemHandler}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
        ItemSeparatorComponent={separatorComponent}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        style={pickerStyles.flatList}
        contentContainerStyle={contentContainerStyle}
        getItemLayout={getItemLayout}
      />
      <Button title={t("picker.select")} onPress={submit} />
    </Modal>
  );
};

// Keep legacy styles for backward compatibility if needed elsewhere
const styles = StyleSheet.create({
  ...pickerStyles,
  ...multiSelectStyles,
});

export { styles };

export default React.memo(MultiSelectPickerModal);
