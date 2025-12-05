import { usePickerSearch } from "@/hooks/usePickerSearch";
import useLocale from "@/hooks/useLocale";
import { Entity, Nestable } from "@/types/DataTypes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, FlatListProps, StyleSheet, View } from "react-native";
import { Modal } from "../core";
import SearchInput from "../form/SearchInput";
import NoDataFound from "../widgets/NoDataFound";
import PathList from "../widgets/PathList";
import { pickerStyles } from "../widgets/picker/pickerStyles";
import PickerItem from "./PickerItem";

export interface PickerModalProps<T extends Entity & Nestable> {
  items: T[];
  isModalVisible: boolean;
  onItemChange: (item: Entity) => void;
  onCloseModal: () => void;
  headerTitle?: string;
  defaultValue?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  multiLevel?: boolean;
  keyboardShouldPersistTaps?: FlatListProps<Entity>["keyboardShouldPersistTaps"];
  renderItem?: (info: {
    item: T;
    index: number;
    selectedValue?: string;
    onCloseModal: () => void;
    onItemChange: (value: Entity, selected?: boolean) => void;
  }) => React.ReactElement | null;
}

const PickerModal = <T extends Entity & Nestable>({
  items,
  isModalVisible,
  headerTitle,
  defaultValue,
  searchable,
  searchPlaceholder,
  onItemChange,
  onCloseModal,
  keyboardShouldPersistTaps,
  multiLevel = false,
  renderItem,
}: PickerModalProps<T>) => {
  const { t } = useLocale("common");
  const [path, setPath] = useState<T[]>([]);

  // Filter items by hierarchy level first (for multiLevel support)
  const hierarchyItems = useMemo(() => {
    if (!multiLevel) {
      return items;
    }
    const currentParent = path[path.length - 1];
    return currentParent
      ? items.filter((i) => i.parent === currentParent.id)
      : items.filter((i) => i.level === 0);
  }, [items, path, multiLevel]);

  // Use search hook for debounced search with localized name support
  const { searchText, filteredItems, setSearchText, clearSearch } =
    usePickerSearch({
      items: hierarchyItems,
      debounceMs: 300,
    });

  // Reset state when items change or modal closes
  useEffect(() => {
    clearSearch();
    setPath([]);
  }, [items, clearSearch]);

  useEffect(() => {
    if (!isModalVisible) {
      clearSearch();
    }
  }, [isModalVisible, clearSearch]);

  const onItemSelect = useCallback(
    (i: T) => {
      if (!multiLevel || i.level === -1 || i.hasChildren === false) {
        onItemChange(i);
        if (!renderItem) {
          onCloseModal();
        }
      } else {
        // Drill into children
        setPath((prev) => [...prev, i]);
        clearSearch();
      }
    },
    [multiLevel, onCloseModal, onItemChange, renderItem, clearSearch]
  );

  const handleItemChange = useCallback(
    (value: Entity) => {
      onItemSelect(value as T);
    },
    [onItemSelect]
  );

  const renderItemHandler = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      if (renderItem) {
        return renderItem({
          item,
          index,
          onItemChange: handleItemChange,
          onCloseModal,
          selectedValue: defaultValue?.toString(),
        });
      }
      return (
        <PickerItem
          item={item}
          onChange={handleItemChange}
          selected={item.id.toString() === defaultValue?.toString()}
          chevronStyle={
            multiLevel && item.level === 0 ? pickerStyles.chevron : undefined
          }
        />
      );
    },
    [renderItem, handleItemChange, onCloseModal, defaultValue, multiLevel]
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

  const onBackHandler = useCallback(() => {
    if (path.length === 0) {
      onCloseModal();
    } else {
      setPath((prev) => prev.slice(0, -1));
    }
  }, [onCloseModal, path.length]);

  const keyExtractor = useCallback((i: T) => i.id, []);

  const showPathList = !!items && !!multiLevel && !!searchText;

  const contentContainerStyle = useMemo(
    () => (filteredItems.length === 0 ? pickerStyles.noData : undefined),
    [filteredItems.length]
  );

  if (!items) {
    return null;
  }

  return (
    <Modal
      style={pickerStyles.modal}
      isVisible={isModalVisible}
      swipeDirection={["down"]}
      showHeaderNav
      title={headerTitle}
      position="full"
      onClose={onBackHandler}
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
      {showPathList ? (
        <PathList
          data={items}
          searchText={searchText}
          onSelect={onItemSelect}
          ListEmptyComponent={listEmptyComponent}
        />
      ) : (
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
      )}
    </Modal>
  );
};

// Keep local styles reference for backward compatibility
const styles = StyleSheet.create({
  ...pickerStyles,
});

export { styles };

export default React.memo(PickerModal);
