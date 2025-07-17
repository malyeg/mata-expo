import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Entity, Nestable } from "@/types/DataTypes";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useImmerReducer } from "use-immer";
import { Modal } from "../core";
import SearchInput from "../form/SearchInput";
import NoDataFound from "../widgets/NoDataFound";
import PathList from "../widgets/PathList";
import pickerReducer, { PickerState } from "../widgets/picker/pickerReducer";
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
const PickerModal = <T extends Entity>({
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
  const isFirstRun = useRef(true);

  const { t } = useLocale("common");
  const foundItem = useMemo(
    () =>
      defaultValue
        ? items.find((item) => {
            return item.id.toString() === defaultValue?.toString();
          })
        : undefined,
    [defaultValue, items]
  );

  const initialState: PickerState = {
    items,
    listItems: multiLevel
      ? items.filter((i) => (i as unknown as Nestable).level === 0)
      : [...items],
    defaultItem: foundItem,
    isModalVisible: isModalVisible,
    path: [],
    multiLevel,
  };

  const [state, dispatch] = useImmerReducer(pickerReducer, initialState);
  const { listItems, path, searchValue } = state;

  useEffect(() => {
    // init();
    if (isFirstRun.current) {
      // if (false) {
      isFirstRun.current = false;
      return;
    }

    dispatch({
      type: "LOAD_ITEMS",
      items,
      defaultValue,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const searchHandler = useCallback(
    (value: string) => {
      dispatch({
        type: "SEARCH_ITEMS",
        search: value,
      });
    },
    [dispatch]
  );

  const onItemSelect = useCallback(
    (i: T) => {
      const nestedEntity = i as unknown as Nestable;
      if (
        !multiLevel ||
        nestedEntity.level === -1 ||
        nestedEntity.hasChildren === false
      ) {
        onItemChange(i);
        if (!renderItem) {
          onCloseModal();
        }
      } else {
        dispatch({
          type: "SELECT_ITEM",
          item: i,
        });
      }
    },
    [dispatch, multiLevel, onCloseModal, onItemChange, renderItem]
  );

  const renderItemHandler = ({ item, index }: { item: T; index: number }) => {
    if (renderItem) {
      return renderItem({
        item,
        index,
        onItemChange: onItemSelect,
        onCloseModal,
        selectedValue: defaultValue?.toString(),
      });
    }
    return (
      <PickerItem
        item={item}
        onChange={onItemSelect}
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
    (data, index) => ({
      length: 60,
      offset: 60 * index,
      index,
    }),
    []
  );

  const onBackHandler = useCallback(() => {
    if (path?.length === 0) {
      onCloseModal();
    } else {
      dispatch({
        type: "BACK",
      });
    }
  }, [dispatch, onCloseModal, path]);

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
          data={items as Nestable[]}
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
