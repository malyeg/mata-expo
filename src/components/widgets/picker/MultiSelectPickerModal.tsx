import { Button, Modal } from "@/components/core";
import SearchInput from "@/components/form/SearchInput";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Entity, Nestable } from "@/types/DataTypes";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import NoDataFound from "../NoDataFound";
import SelectablePickerItem from "./SelectablePickerItem";

export interface MultiSelectPickerModalProps<T extends Entity & Nestable> {
  items: T[];
  isModalVisible: boolean;
  style?: ViewStyle;
  onCloseModal: () => void;
  position?: "bottom" | "full";
  showHeaderLeft?: boolean;
  headerTitle?: string;
  defaultValues?: string[];
  searchPlaceholder?: string;
  searchable?: boolean;
  keyboardShouldPersistTaps?: FlatListProps<Entity>["keyboardShouldPersistTaps"];
  onSearch?: (searchText: string) => void;
  onSelectItems: (items: T[]) => void;
}
const MultiSelectPickerModal = <T extends Entity>({
  items,
  position = "full",
  isModalVisible,
  showHeaderLeft = true,
  headerTitle,
  style,
  defaultValues,
  searchable,
  searchPlaceholder,
  onSelectItems,
  onCloseModal,
  keyboardShouldPersistTaps,
}: MultiSelectPickerModalProps<T>) => {
  const { t } = useLocale("common");
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [selectedItems, setSelectedItems] = useState<T[] | undefined>();
  const [searchText, setSearchText] = useState("");
  const searchSubjectRef = useRef(new Subject<string>());

  useEffect(() => {
    searchSubjectRef.current
      .asObservable()
      .pipe(distinctUntilChanged(), debounceTime(400))
      .subscribe((val) => {
        if (!!val && val.trim() !== "") {
          const newFilteredItems = items.filter((i) => {
            return i.name?.toLowerCase().includes(val.trim().toLowerCase());
          });
          setFilteredItems(newFilteredItems);
        } else {
          setFilteredItems([...items]);
        }
        // setSearchText(val);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredItems([...items]);
  }, [items]);

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

  const searchHandler = (value: string) => {
    setSearchText(value);
    searchSubjectRef.current.next(value);
  };

  const updateItems = (i: any, selected: boolean) => {
    setSelectedItems((freshItems) => {
      let newItems = freshItems ? [...freshItems] : [];
      if (selected) {
        newItems.push(i);
      } else {
        newItems = newItems?.filter((n) => n.id !== i.id);
      }
      return newItems;
    });
  };

  const renderItemHandler = ({ item }: { item: T; index: number }) => {
    const onChange = (i: any, selected: boolean) => updateItems(i, selected);
    return (
      <SelectablePickerItem
        item={item}
        onChange={onChange}
        label={item.name ?? item.id}
        selected={!!selectedItems?.find((i) => i.id === item.id)}
      />
    );
  };

  const listEmptyComponent = () => <NoDataFound style={styles.noData} />;
  const separatorComponent = () => <View style={styles.separator} />;
  const getItemLayout = (data: any, index: number) => ({
    length: 60,
    offset: 60 * index,
    index,
  });

  const keyExtractor = (i: T) => {
    return i.id;
  };

  const submit = () => {
    onSelectItems(selectedItems as T[]);
  };
  const onSelectAllChange = (item: any, selected: boolean) => {
    // onSelectItems(selectedItems as T[]);
    if (selected) {
      setSelectedItems([...items]);
    } else {
      setSelectedItems([]);
    }
  };

  return filteredItems && selectedItems ? (
    <Modal
      style={styles.modal}
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
          style={styles.searchInput}
          value={searchText}
          placeholder={searchPlaceholder ?? t("picker.searchPlaceholder")}
          onChangeText={searchHandler}
        />
      )}
      {!searchText && (
        <SelectablePickerItem
          style={styles.selectAll}
          item={{ id: "-1", name: "all" }}
          label="Select All"
          onChange={onSelectAllChange}
          labelStyle={styles.allLabel}
          selected={items.length === selectedItems.length}
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
        style={styles.flatList}
        contentContainerStyle={
          !!filteredItems && filteredItems.length === 0
            ? styles.noData
            : undefined
        }
        getItemLayout={getItemLayout}
      />
      <Button title="Select" onPress={submit} />
    </Modal>
  ) : null;
};

const styles = StyleSheet.create({
  modal: {
    // margin: 0,
    // flex: 1,
    // justifyContent: 'flex-end',
  },
  itemContainer: {
    flexDirection: "row",
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    height: 61,
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
  selectAll: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.lightGrey,
  },
  allLabel: {
    fontWeight: "bold",
  },
});

export default React.memo(MultiSelectPickerModal);
