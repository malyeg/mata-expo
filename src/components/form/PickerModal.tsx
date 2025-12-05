import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { Entity, Nestable } from "@/types/DataTypes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Modal } from "../core";
import SearchInput from "../form/SearchInput";
import NoDataFound from "../widgets/NoDataFound";
import PathList from "../widgets/PathList";
import PickerItem from "./PickerItem";

export interface PickerModalProps<T extends Entity & Nestable> {
  items: T[];
  isModalVisible: boolean;
  style?: ViewStyle;
  onItemChange: (item: Entity) => void;
  onCloseModal: () => void;
  position?: "bottom" | "full";
  showHeaderLeft?: boolean;
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

  const [searchValue, setSearchValue] = useState("");
  const [path, setPath] = useState<T[]>([]);

  // Reset state when items change
  useEffect(() => {
    setSearchValue("");
    setPath([]);
  }, [items]);

  // Derive listItems from items, path, and searchValue
  const listItems = useMemo(() => {
    const currentParent = path[path.length - 1];

    // Filter by hierarchy level
    let filtered: T[];
    if (multiLevel) {
      filtered = currentParent
        ? items.filter((i) => i.parent === currentParent.id)
        : items.filter((i) => i.level === 0);
    } else {
      filtered = [...items];
    }

    // Apply search filter
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter((item) => {
        // Check all localized names
        const localizedNames = item.localizedName
          ? Object.values(item.localizedName)
          : [];
        const matchesLocalized = localizedNames.some((name) =>
          name?.toLowerCase().includes(search)
        );
        // Check regular name
        const matchesName = item.name?.toLowerCase().includes(search);
        return matchesLocalized || matchesName;
      });
    }

    return filtered;
  }, [items, path, searchValue, multiLevel]);

  const searchHandler = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

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
        setSearchValue("");
      }
    },
    [multiLevel, onCloseModal, onItemChange, renderItem]
  );

  const handleItemChange = useCallback(
    (value: Entity) => {
      onItemSelect(value as T);
    },
    [onItemSelect]
  );

  const renderItemHandler = ({ item, index }: { item: T; index: number }) => {
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
          multiLevel && item.level === 0 ? styles.chevron : undefined
        }
      />
    );
  };

  const listEmptyComponent = useCallback(
    () => <NoDataFound style={styles.noData} />,
    []
  );
  const separatorComponent = () => <View style={styles.separator} />;
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

  const keyExtractor = (i: T) => {
    return i.id;
  };

  const showPathList = !!items && !!multiLevel && !!searchValue;

  return items ? (
    <Modal
      style={styles.modal}
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
          style={styles.searchInput}
          value={searchValue}
          placeholder={searchPlaceholder ?? t("picker.searchPlaceholder")}
          onChangeText={searchHandler}
        />
      )}
      {showPathList && searchValue ? (
        <PathList
          data={items}
          searchText={searchValue}
          onSelect={onItemSelect}
          ListEmptyComponent={listEmptyComponent}
        />
      ) : (
        <FlatList
          data={listItems as T[]}
          showsVerticalScrollIndicator={false}
          renderItem={renderItemHandler}
          keyExtractor={keyExtractor}
          ListEmptyComponent={listEmptyComponent}
          ItemSeparatorComponent={separatorComponent}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          style={styles.flatList}
          contentContainerStyle={
            !!items && items.length === 0 ? styles.noData : undefined
          }
          getItemLayout={getItemLayout}
        />
      )}
    </Modal>
  ) : null;
};

const styles = StyleSheet.create({
  modal: {
    // margin: 0,
    // flex: 1,
    // justifyContent: 'flex-end',
  },
  bottomModal: {
    flex: 0.5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 30,
    paddingTop: 30,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalNav: {
    left: 0,
    position: "absolute",
    marginHorizontal: -20,
  },
  modalTitle: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
    alignSelf: "center",
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 30,
  },
  searchInput: {
    // marginHorizontal: -15,
  },
  flatList: {
    flex: 1,
  },
  noData: {
    flex: 0.75,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
  chevron: {
    color: theme.colors.green,
  },
});

export default React.memo(PickerModal);
