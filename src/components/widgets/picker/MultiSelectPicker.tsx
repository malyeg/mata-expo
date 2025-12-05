import { Icon, Text } from "@/components/core";
import Error from "@/components/form/Error";
import { pickerInputStyles } from "@/components/form/pickerInputStyles";
import useController from "@/hooks/useController";
import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { Entity } from "@/types/DataTypes";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { FlatListProps, Pressable, View, ViewStyle } from "react-native";
import MultiSelectPickerModal from "./MultiSelectPickerModal";

export interface MultiSelectPickerProps<T extends Entity> {
  name: string;
  items: T[];
  placeholder?: string;
  modalTitle?: string;
  label?: string;
  style?: ViewStyle;
  defaultValue?: string[];
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  control: any;
  showReset?: boolean;
  hideLabel?: boolean;
  keyboardShouldPersistTaps?: FlatListProps<Entity>["keyboardShouldPersistTaps"];
}

const MultiSelectPicker = forwardRef(function MultiSelectPicker<
  T extends Entity
>(
  {
    name,
    items,
    placeholder,
    label,
    defaultValue,
    disabled = false,
    control,
    modalTitle,
    showReset,
    searchable,
    searchPlaceholder,
    keyboardShouldPersistTaps,
    hideLabel,
    style,
  }: MultiSelectPickerProps<T>,
  ref: React.Ref<{ open: () => void; close: () => void }>
) {
  const { t, locale } = useLocale("common");
  const [isModalVisible, setModalVisible] = useState(false);

  const { field, formState } = useController({
    control,
    defaultValue: defaultValue ?? [],
    name,
  });

  // Derive selected items from field value
  const selectedItems = useMemo(() => {
    if (!field.value || !Array.isArray(field.value)) {
      return [];
    }
    return items.filter((item) =>
      (field.value as string[]).includes(item.id?.toString())
    );
  }, [field.value, items]);

  useImperativeHandle(ref, () => ({
    open() {
      setModalVisible(true);
    },
    close() {
      setModalVisible(false);
    },
  }));

  const openModal = useCallback(() => {
    if (!disabled) {
      setModalVisible(true);
    }
  }, [disabled]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const onSelectItems = useCallback(
    (items: Entity[]) => {
      field.onChange(items.map((i) => i.id));
      closeModal();
    },
    [field, closeModal]
  );

  const onResetHandler = useCallback(() => {
    field.onChange([]);
  }, [field]);

  // Display text for selected items
  const displayText = useMemo(() => {
    if (selectedItems.length === 0) {
      return placeholder ?? t("picker.pickerPlaceholder");
    }
    return selectedItems
      .map((item) => item.localizedName?.[locale] ?? item.name ?? item.id)
      .join(", ");
  }, [selectedItems, placeholder, t, locale]);

  const hasError = !!formState.errors[name];
  const hasValue = selectedItems.length > 0;

  return (
    <>
      <View style={[pickerInputStyles.container, style]}>
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
          <Pressable
            onPress={openModal}
            style={pickerInputStyles.inputContainer}
          >
            <Text
              style={[
                pickerInputStyles.inputText,
                !hasValue && pickerInputStyles.placeholderText,
              ]}
              numberOfLines={1}
            >
              {displayText}
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
      <MultiSelectPickerModal
        headerTitle={modalTitle ?? placeholder}
        items={items}
        defaultValues={selectedItems.map((i) => i.id)}
        isModalVisible={isModalVisible}
        onCloseModal={closeModal}
        onSelectItems={onSelectItems}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      />
    </>
  );
});

MultiSelectPicker.displayName = "MultiSelectPicker";

export default React.memo(MultiSelectPicker);
