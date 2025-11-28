import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  FlatListProps,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import useController from "../../hooks/useController";
import useLocale from "../../hooks/useLocale";
import { theme } from "../../styles/theme";
import { Entity } from "../../types/DataTypes";
import { Icon, Text } from "../core";
import Error from "./Error";
import PickerModal, { PickerModalProps } from "./PickerModal";

export interface PickerProps<T extends Entity> {
  name: string;
  items: T[];
  position?: PickerModalProps<T>["position"];
  placeholder?: string;
  modalTitle?: string;
  label?: string;
  style?: ViewStyle;
  defaultValue?: string;
  onChange?: (value: string, selected?: boolean) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  modalStyle?: ViewStyle;
  showHeaderLeft?: boolean;
  onSelectClose?: boolean;
  disabled?: boolean;
  control: any;
  showReset?: boolean;
  onReset?: (name: string) => void;
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

const Picker = forwardRef(function Picker<T extends Entity>(
  {
    name,
    items,
    placeholder,
    label,
    defaultValue,
    onChange,
    disabled = false,
    control,
    modalTitle,
    onReset,
    renderItem,
    showReset,
    multiLevel = false,
    keyboardShouldPersistTaps,
    hideLabel,
    ...props
  }: PickerProps<T>,
  ref: React.Ref<unknown>
) {
  useImperativeHandle(ref, () => ({
    open() {
      setModalVisible(true);
    },
    close() {
      setModalVisible(false);
    },
  }));
  const { t } = useLocale("common");
  const [isModalVisible, setModalVisible] = useState(false);

  const { field, formState } = useController({
    control,
    defaultValue: defaultValue?.toString() ?? "",
    name,
  });

  const onItemChange = useCallback(
    (item: Entity) => {
      field.onChange(item.id?.toString());
      if (onChange) {
        onChange(item.id, true);
      }
    },
    [field, onChange]
  );

  const openModal = useCallback(() => {
    !disabled && setModalVisible(true);
  }, [disabled]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onResetHandler = useCallback(() => {
    field.onChange("");
  }, [field]);

  const selectedItem = useMemo(
    () => items.find((i) => i?.id?.toString() === field.value),
    [field.value, items]
  );

  const { locale } = useLocale();
  console.log("locale", locale, items?.[0]?.localizedName);

  return (
    <>
      <View style={[styles.container, props.style]}>
        {!hideLabel && (
          <Text body3 style={styles.label}>
            {field.value ? label ?? placeholder : ""}
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
                selectedItem?.name ? {} : styles.placeholderText,
              ]}
              numberOfLines={1}
            >
              {selectedItem?.localizedName?.[locale] ??
                selectedItem?.name ??
                placeholder ??
                t("picker.pickerPlaceholder")}
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
          {showReset && !!field.value && (
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
      <PickerModal
        {...props}
        headerTitle={modalTitle}
        items={items as Entity[]}
        defaultValue={selectedItem?.id}
        isModalVisible={isModalVisible}
        onItemChange={onItemChange}
        onCloseModal={closeModal}
        renderItem={renderItem}
        multiLevel={multiLevel}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      />
    </>
  );
});

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
    // flexGrow: 1,
    // color: theme.colors.grey,
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

export default React.memo(Picker);
