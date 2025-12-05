import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { FlatListProps, Pressable, View, ViewStyle } from "react-native";
import useController from "../../hooks/useController";
import useLocale from "../../hooks/useLocale";
import { theme } from "../../styles/theme";
import { Entity } from "../../types/DataTypes";
import { Icon, Text } from "../core";
import Error from "./Error";
import { pickerInputStyles } from "./pickerInputStyles";
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
  const { t, locale } = useLocale("common");
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

  const hasError = !!formState.errors[name];
  const hasValue = !!field.value;

  return (
    <>
      <View style={[pickerInputStyles.container, props.style]}>
        {!hideLabel && (
          <Text body3 style={pickerInputStyles.label}>
            {hasValue ? label ?? placeholder : ""}
          </Text>
        )}
        <View
          style={[
            pickerInputStyles.pickerContainer,
            pickerInputStyles.textInputBorder,
            hasError && pickerInputStyles.textInputBorderError,
          ]}
        >
          <Pressable onPress={openModal} style={pickerInputStyles.inputContainer}>
            <Text
              style={[
                pickerInputStyles.inputText,
                !selectedItem?.name && pickerInputStyles.placeholderText,
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
                style={pickerInputStyles.pickerIcon}
              />
            )}
          </Pressable>
          {showReset && hasValue && (
            <Icon
              name="close"
              size={20}
              color={theme.colors.green}
              style={pickerInputStyles.resetIcon}
              onPress={onResetHandler}
            />
          )}
        </View>

        {hasError && <Error error={formState.errors[name]} />}
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

export default React.memo(Picker);
