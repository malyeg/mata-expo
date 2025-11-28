import { Icon, Text } from "@/components/core";
import Error from "@/components/form/Error";
import useController from "@/hooks/useController";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Entity } from "@/types/DataTypes";
import { LoggerFactory } from "@/utils/logger";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import {
  FlatListProps,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useImmerReducer } from "use-immer";
import MultiSelectPickerModal, {
  MultiSelectPickerModalProps,
} from "./MultiSelectPickerModal";
import MultiSelectPickerReducer, {
  MultiSelectPickerState,
} from "./MutliSelectPickerReducer";

export interface MultiSelectPickerProps<T extends Entity> {
  name: string;
  items: T[];
  position?: MultiSelectPickerModalProps<T>["position"];
  placeholder?: string;
  modalTitle?: string;
  label?: string;
  style?: ViewStyle;
  defaultValue?: string[];
  searchable?: boolean;
  searchPlaceholder?: string;
  modalStyle?: ViewStyle;
  showHeaderLeft?: boolean;
  onSelectClose?: boolean;
  disabled?: boolean;
  control: any;
  showReset?: boolean;
  renderItem?: (info: {
    item: Entity;
    index: number;
    selectedValue?: string;

    onCloseModal: () => void;
    onItemChange: (value: Entity, selected?: boolean) => void;
  }) => React.ReactElement | null;
  multiLevel?: boolean;
  hideLabel?: boolean;
  keyboardShouldPersistTaps?: FlatListProps<Entity>["keyboardShouldPersistTaps"];
}

const logger = LoggerFactory.getLogger("MultiSelectPicker");
const MultiSelectPicker = forwardRef(
  <T extends Entity>(
    {
      name,
      items,
      placeholder,
      label,
      defaultValue,
      disabled = false,
      control,
      modalTitle,
      renderItem,
      showReset,
      multiLevel = false,
      keyboardShouldPersistTaps,
      hideLabel,
      ...props
    }: MultiSelectPickerProps<T>,
    ref
  ) => {
    const { t } = useLocale("common");

    const { field, formState } = useController({
      control,
      defaultValue: defaultValue ?? [],
      name,
    });

    const [state, dispatch] = useImmerReducer(MultiSelectPickerReducer, {
      items,
      listItems: [...items],
      defaultItems: defaultValue
        ? items.filter((item) => defaultValue?.includes(item.id.toString()))
        : undefined,
      isModalVisible: false,
    } as MultiSelectPickerState);
    const { selectedItems, isModalVisible } = state;

    useImperativeHandle(ref, () => ({
      open() {
        dispatch({ type: "SET_MODAL", isVisible: true });
      },
      close() {
        dispatch({ type: "SET_MODAL", isVisible: true });
      },
    }));

    useEffect(() => {
      dispatch({
        type: "LOAD_ITEMS",
        items,
        defaultValue,
      });
    }, [defaultValue, dispatch, items]);

    useEffect(() => {
      const updatedItems = items.filter(
        (i) => !!field.value && field.value.includes(i?.id?.toString())
      );
      dispatch({
        type: "SELECT_ITEMS",
        items: updatedItems,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.value]);

    const onSearch = (searchText: string) => {
      dispatch({
        type: "SEARCH_ITEMS",
        searchText,
      });
    };

    const onItemChange = useCallback((items: Entity[]) => {
      field.onChange(items.map((i) => i.id));
      closeModal();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openModal = useCallback(() => {
      !disabled && dispatch({ type: "SET_MODAL", isVisible: true });
    }, [disabled, dispatch]);

    const closeModal = useCallback(() => {
      dispatch({ type: "SET_MODAL", isVisible: false });
    }, [dispatch]);

    const onResetHandler = useCallback(() => {
      field.onChange([]);
    }, [field]);

    return (
      <>
        <View style={[styles.container, props.style]}>
          {!hideLabel && (
            <Text body3 style={styles.label}>
              {field.value && field.value?.length > 0
                ? label ?? placeholder
                : ""}
            </Text>
          )}
          <View
            style={[
              styles.pickerContainer,
              styles.textInputBorder,
              formState.errors[name]
                ? styles.textInputBorderError
                : styles.textInputBorder,
            ]}
          >
            <Pressable onPress={openModal} style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputText,
                  selectedItems?.length! > 0 ? {} : styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {selectedItems && selectedItems.length > 0
                  ? selectedItems?.map((s) => s.name).join(", ")
                  : placeholder ?? t("picker.pickerPlaceholder")}
              </Text>
              {!disabled && (
                <Icon
                  name="chevron-down"
                  size={30}
                  color={theme.colors.green}
                  style={styles.pickerIcon}
                />
              )}
            </Pressable>
            {showReset && field.value && field.value.length > 0 && (
              <Icon
                name="close"
                size={20}
                color={theme.colors.green}
                style={styles.resetIcon}
                onPress={onResetHandler}
              />
            )}
          </View>

          {!!formState.errors[name] && <Error error={formState.errors[name]} />}
        </View>
        <MultiSelectPickerModal
          {...props}
          headerTitle={modalTitle ?? placeholder}
          items={items as Entity[]}
          defaultValues={selectedItems?.map((i) => i.id)}
          isModalVisible={isModalVisible ?? false}
          onCloseModal={closeModal}
          renderItem={renderItem}
          multiLevel={multiLevel}
          onSearch={onSearch}
          onSelectItems={onItemChange}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        />
      </>
    );
  }
);

MultiSelectPicker.displayName = "MultiSelectPicker";

const styles = StyleSheet.create({
  container: {
    // height: 100,
  },
  pickerContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'grey',
    // justifyContent: 'flex-start',
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: 'red',
  },

  inputText: {
    // flex: 1,
  },
  placeholderText: {
    color: theme.colors.grey,
  },
  label: {
    color: theme.colors.grey,
  },

  searchInput: {
    marginHorizontal: -15,
  },
  noData: {
    flex: 0.75,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
  textInputBorder: {
    ...theme.styles.inputBorder,
  },
  textInputBorderError: {
    borderBottomColor: theme.colors.salmon,
    borderBottomWidth: 1,
  },
  pickerIcon: {
    marginRight: -6,
    flexShrink: 1,
    flexGrow: 0,
  },
  resetIcon: {
    flexGrow: 0,
    flexShrink: 1,
    marginLeft: 10,
  },
});

export default React.memo(MultiSelectPicker);
