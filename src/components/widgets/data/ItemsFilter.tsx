import categoriesApi, { Category } from "@/api/categoriesApi";
import countriesApi from "@/api/countriesApi";
import { conditionList, swapList, SwapType } from "@/api/itemsApi";
import { Button, Modal } from "@/components/core";
import { Picker, TextInput } from "@/components/form";
import useAuth from "@/hooks/useAuth";
import useFormBuilder from "@/hooks/useFormBuilder";
import useLocale from "@/hooks/useLocale";
import useLocation from "@/hooks/useLocation";
import { Country, State } from "@/models/place.model";
import theme from "@/styles/theme";
import { Entity } from "@/types/DataTypes";
import { LoggerFactory } from "@/utils/logger";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import MultiSelectPicker from "../picker/MultiSelectPicker";

export interface ItemsFilterForm {
  searchInput?: string;
  category?: Category;
  swapTypes?: typeof swapList;
  swapCategory?: Category;
  states?: State[];
  country?: Country;
  conditionTypes?: typeof conditionList;
}
export interface ItemsFilterValues {
  searchInput?: string;
  categoryId?: string;
  swapTypes?: string[];
  swapCategoryId?: string;
  stateIds?: string[];
  countryId?: string;
  conditionTypes?: string[];
}
export interface ItemsFilterProps {
  onChange: (filters: ItemsFilterForm) => void;
  style?: StyleProp<ViewStyle>;
  defaultValues?: ItemsFilterForm;
  openOnLoad?: boolean;
  onClose?: () => void;
  focusOn?: "search" | "states";
}

const logger = LoggerFactory.getLogger("ItemsFilter");

const ItemsFilter = ({
  defaultValues = {},
  onChange,
  onClose,
  style,
  focusOn,
  openOnLoad = false,
}: ItemsFilterProps) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  // const [swapType, setSwapType] = useState<SwapType | null>(null);
  const [states, setStates] = useState<State[] | undefined>([]);
  const { t } = useLocale("widgets");
  const { user } = useAuth();
  const { location } = useLocation();
  const textInputRef = useRef<any>(null);
  const statesRef = useRef<any>(null);
  const firstLoadRef = useRef(true);
  const { control, handleSubmit, setValue, watch, reset } =
    useFormBuilder<ItemsFilterValues>((yup) =>
      yup.object({
        searchInput: yup
          .string()
          .trim()
          .matches(/^(|.{3,})$/, t("itemsFilter.searchInput.minLength")),
        categoryId: yup.string().trim(),
        swapTypes: yup.array(),
        swapCategoryId: yup
          .string()
          .trim()
          .test(
            "swapCategoryId",
            t("itemsFilter.swapCategory.required"),
            function (value) {
              if (this.parent.swapType === ("swapWithAnother" as SwapType)) {
                return !!value;
              }
              return true;
            }
          ),
        stateIds: yup.array(),
        countryId: yup.string().trim(),
        conditionTypes: yup.array(),
      })
    );
  const countryId = watch("countryId");
  const swapTypes = watch("swapTypes");

  // useEffect(() => {
  //   if (focusOn === 'search') {
  //     textInputRef?.current?.focus();
  //   } else if (focusOn === 'states') {
  //     statesRef?.current?.open();
  //   }
  // }, [focusOn]);

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }
    reset({
      categoryId: defaultValues?.category?.id.toString(),
      conditionTypes: defaultValues?.conditionTypes?.map((s) =>
        s.id.toString()
      ),
      countryId: defaultValues?.country?.id.toString(),
      searchInput: defaultValues?.searchInput,
      stateIds: defaultValues?.states?.map((s) => s.id.toString()),
      swapCategoryId: defaultValues?.swapCategory?.id.toString(),
      swapTypes: defaultValues?.swapTypes?.map((s) => s.id.toString()),
    });
  }, [defaultValues, reset]);

  useEffect(() => {
    if (openOnLoad) {
      setModalVisible(true);
    }
  }, [openOnLoad]);

  useEffect(() => {
    const stateList = countriesApi.getStates(
      countryId ?? location?.country?.id!
    );
    setStates(stateList);
    setValue("stateIds", []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId]);

  useEffect(() => {
    if (swapTypes?.includes("swapWithAnother")) {
      setValue("swapCategoryId", "");
    }
  }, [setValue, swapTypes]);

  const onSubmit = (data: ItemsFilterValues) => {
    logger.log("data.stateIds", data.stateIds);
    const filters: ItemsFilterForm = {};
    !!data.categoryId &&
      (filters.category = categoriesApi.getById(data.categoryId));
    !!data.conditionTypes &&
      (filters.conditionTypes = conditionList.filter((s) =>
        data.conditionTypes?.includes(s.id)
      ));
    !!data.countryId &&
      (filters.country = countriesApi.getById(data.countryId));
    !!data.searchInput && (filters.searchInput = data.searchInput);
    !!data.stateIds &&
      (filters.states = countriesApi.getStatesByIds(data.stateIds));
    if (data.swapTypes) {
      filters.swapTypes = swapList.filter((s) =>
        data.swapTypes?.includes(s.id)
      );
      !!data.swapCategoryId &&
        (filters.swapCategory = categoriesApi.getById(data.swapCategoryId));
    }

    onChange(filters);
    setModalVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const onFormError = (data: any) => {
    console.log(data);
  };

  const onReset = (name: string) => {
    setValue(
      name as keyof ItemsFilterValues,
      name === "stateIds" ? undefined : ""
    );
  };

  const onBack = () => {
    reset(defaultValues);
    setModalVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const onModalShow = () => {
    if (focusOn === "search") {
      textInputRef?.current?.focus();
    } else if (focusOn === "states") {
      statesRef?.current?.open();
    }
  };

  const countries = useMemo(
    () =>
      countriesApi
        .getCountries()
        .filter((c) => ["nz", "au"].includes(c.code.toLowerCase())),
    []
  );

  const isCountryPickerVisible = !location || user?.isAdmin;

  return (
    <Modal
      position="full"
      isVisible={isModalVisible}
      showHeaderNav={true}
      title={t("itemsFilter.title")}
      onModalShow={onModalShow}
      containerStyle={styles.modal}
      onClose={onBack}
    >
      {defaultValues && (
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.container, style]}
        >
          <View style={styles.form}>
            <TextInput
              ref={textInputRef}
              name="searchInput"
              style={styles.searchInput}
              defaultValue={defaultValues.searchInput}
              placeholder={t("itemsFilter.searchInput.placeholder")}
              returnKeyType="next"
              returnKeyLabel="next"
              placeholderTextColor={theme.colors.grey}
              control={control}
              showReset
              hideLabel
              onReset={onReset}
            />
            {isCountryPickerVisible && (
              <Picker
                searchable
                placeholder={t("itemsFilter.country.placeholder")}
                name="countryId"
                items={countries}
                defaultValue={defaultValues?.country?.id?.toString()}
                control={control}
                keyboardShouldPersistTaps="always"
                showReset={user.isAdmin || user.isTester}
              />
            )}
            <MultiSelectPicker
              ref={statesRef}
              searchable
              placeholder={t("itemsFilter.state.placeholder")}
              name="stateIds"
              items={states as Entity[]}
              control={control}
              showReset
              keyboardShouldPersistTaps="always"
            />
            <Picker
              name="categoryId"
              searchable
              items={categoriesApi.getAll()}
              placeholder={t("itemsFilter.category.placeholder")}
              modalTitle={t("itemsFilter.category.modalTitle")}
              defaultValue={defaultValues?.category?.id?.toString()}
              control={control}
              multiLevel
              showReset
            />
            <MultiSelectPicker
              name="conditionTypes"
              items={conditionList as Entity[]}
              placeholder={t("itemsFilter.condition.placeholder")}
              modalTitle={t("itemsFilter.condition.modalTitle")}
              control={control}
              showReset
            />

            <MultiSelectPicker
              name="swapTypes"
              items={swapList as Entity[]}
              placeholder={t("itemsFilter.swapTypes.placeholder")}
              modalTitle={t("itemsFilter.swapTypes.modalTitle")}
              control={control}
              showReset
            />

            {swapTypes?.includes("swapWithAnother") && (
              <Picker
                name="swapCategoryId"
                searchable
                items={categoriesApi.getAll()}
                placeholder={t("itemsFilter.swapCategory.placeholder")}
                modalTitle={t("itemsFilter.swapCategory.modalTitle")}
                defaultValue={defaultValues?.swapCategory?.id?.toString()}
                control={control}
                multiLevel
                showReset
              />
            )}

            <View style={styles.footer}>
              <Button
                title={t("itemsFilter.showResultsBtnTitle")}
                onPress={handleSubmit(onSubmit, onFormError)}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

export default React.memo(ItemsFilter);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-evenly",
  },

  modal: {
    // flex: 1,
  },
  form: {
    flexGrow: 1,
    justifyContent: "space-evenly",
  },
  label: {
    marginRight: 10,
  },
  footer: {
    justifyContent: "flex-end",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    flexBasis: "48%",
  },
  filterIcon: {
    flexDirection: "row",
    marginVertical: 5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  searchInput: {
    // flex: 1,
    ...theme.styles.scale.body1,
    color: theme.colors.dark,
    // backgroundColor: 'blue',
  },
});
