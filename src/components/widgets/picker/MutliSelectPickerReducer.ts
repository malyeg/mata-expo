import { Entity, Nestable } from "@/types/DataTypes";

export type PickerItem = Entity & Nestable;
export type MultiSelectPickerState<T extends PickerItem = PickerItem> = {
  items: T[];
  listItems: T[];
  selectedItems?: T[];
  defaultItems?: T[];
  isModalVisible?: boolean;
  searchValue?: string;
};

interface LoadItemsAction<T extends PickerItem> {
  type: "LOAD_ITEMS";
  items: T[];
  defaultValue?: string[];
}

interface SelectItemsAction<T extends PickerItem> {
  type: "SELECT_ITEMS";
  items: T[];
}

interface SearchItemsAction {
  type: "SEARCH_ITEMS";
  search: string;
}
interface ResetItemsAction<T extends PickerItem> {
  type: "RESET_ITEMS";
  items: T[];
}
interface SetModalVisibleAction {
  type: "SET_MODAL";
  isVisible: boolean;
}

type PickerAction<T extends PickerItem> =
  | LoadItemsAction<T>
  | SelectItemsAction<T>
  | SearchItemsAction
  | SetModalVisibleAction
  | ResetItemsAction<T>;

const onLoadItems = (
  state: MultiSelectPickerState,
  action: LoadItemsAction<PickerItem>
) => {
  state.defaultItems = undefined;
  state.selectedItems = undefined;
  state.items = action.items;
  state.searchValue = undefined;

  if (action.defaultValue) {
    const foundItems = state.items.filter((item) => {
      return action.defaultValue?.includes(item.id.toString());
    });
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!foundItems) {
      state.selectedItems = foundItems;
      state.defaultItems = foundItems;
      // state.field?.onChange(defaultItem.value);
    }
  }
  return state;
};

const onSearch = (state: MultiSelectPickerState, action: SearchItemsAction) => {
  const searchValue = action.search;

  if (searchValue === state.searchValue) {
    return state;
  }
  let filteredItems;
  if (!!searchValue && searchValue.trim() !== "") {
    filteredItems = state.items.filter((item) => {
      return item.name?.toLowerCase().includes(searchValue.toLowerCase());
    });
  } else {
    filteredItems = state.items;
  }
  state.listItems = filteredItems;
  state.searchValue = searchValue;

  return state;
};

export default function MultiSelectPickerReducer<
  T extends PickerItem = PickerItem
>(state: MultiSelectPickerState, action: PickerAction<T>) {
  switch (action.type) {
    case "LOAD_ITEMS":
      return onLoadItems(state, action);
    case "SEARCH_ITEMS":
      return onSearch(state, action);
    case "SELECT_ITEMS":
      state.selectedItems = action.items ?? [];
      return state;
    case "RESET_ITEMS":
      state.listItems = [...action.items];
      return state;
    case "SET_MODAL":
      state.isModalVisible = action.isVisible;
      return state;
    default:
      return state;
  }
}
