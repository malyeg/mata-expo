import { conditionList } from "@/api/itemsApi";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { FormProps } from "@/types/DataTypes";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Button } from "../core";
import { Error, Picker, TextInput } from "../form";
import PickerItem from "../form/PickerItem";

const WITH_ISSUES_ITEM = conditionList.find((i) => i.id === "usedWithIssues")!;
interface ItemConditionPickerProps extends ViewProps, FormProps {
  // placeholder?: string;
  // control: any;
  label?: string;
}

const ItemConditionPicker = ({
  name,
  control,
  defaultValue = "",
  label,
}: ItemConditionPickerProps) => {
  const [desc, setDesc] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string>();
  const [error, setError] = useState<string>();
  const { t } = useLocale("common");

  useEffect(() => {}, []);

  const onChangeDesc = (v: string) => {
    setDesc(v);
  };
  const onPickerChange = useCallback((v: string) => {
    // setDesc(v);
    setSelectedValue(v);
  }, []);

  const renderItemHandler = ({
    item,
    index,
    onCloseModal,
    onItemChange,
  }: any) => {
    const onPickerItemPress = () => {
      if (item.id.toString() !== "usedWithIssues") {
        onCloseModal();
      }
    };
    const onButtonPress = () => {
      if (desc && desc.length < 200) {
        setError(undefined);
        onItemChange(WITH_ISSUES_ITEM);
        onCloseModal();
      } else {
        setError(t("itemConditionPicker.descError"));
      }
    };
    return (
      <>
        <PickerItem
          item={item}
          onChange={onItemChange}
          selected={selectedValue === item.id.toString()}
          onPress={onPickerItemPress}
        />
        {index === conditionList.length - 1 &&
        selectedValue === WITH_ISSUES_ITEM.id ? (
          <>
            <View style={styles.withIssuesContainer}>
              <TextInput
                label=""
                style={styles.withIssuesInput}
                name="usedWithIssuesDesc"
                placeholder={t("itemConditionPicker.withIssuesDesc")}
                onChangeText={onChangeDesc}
                control={control}
              />
              {!!error && (
                <Error
                  style={styles.error}
                  error={{ type: "required", message: error }}
                />
              )}
              <Button
                title={t("itemConditionPicker.submit")}
                onPress={onButtonPress}
              />
            </View>
          </>
        ) : null}
      </>
    );
  };

  return (
    <Picker
      control={control}
      label={label}
      modalStyle={styles.modal}
      name={name}
      items={conditionList}
      placeholder={t("itemConditionPicker.placeholder")}
      modalTitle={t("itemConditionPicker.modalTitle")}
      onChange={onPickerChange}
      onSelectClose={false}
      renderItem={renderItemHandler}
      // onChange={onChange}
      defaultValue={defaultValue as string}
      hideLabel
    />
  );
};

export default React.memo(ItemConditionPicker);

const styles = StyleSheet.create({
  modal: {
    // flex: 0.6,
    // borderTopStartRadius: 50,
    // borderTopEndRadius: 50,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
  withIssues: {
    borderBottomWidth: 0,
  },
  withIssuesInput: {
    marginBottom: 20,
  },
  withIssuesContainer: {
    marginTop: -20,
  },
  error: {
    marginTop: -10,
    marginBottom: 10,
  },
});
