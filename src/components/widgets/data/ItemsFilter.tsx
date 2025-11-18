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
import { theme } from "@/styles/theme";
import { Entity, Operation, Query } from "@/types/DataTypes";
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
  onChange: (query: Query) => void;
  style?: StyleProp<ViewStyle>;
  defaultValues?: Query;
  openOnLoad?: boolean;
  onClose?: () => void;
  focusOn?: "search" | "states";
}

const logger = LoggerFactory.getLogger("ItemsFilter");

// Helper function to convert Query filters to ItemsFilterValues
const queryToFormValues = (query?: Query): ItemsFilterValues => {
  if (!query?.filters) return {};

  const formValues: ItemsFilterValues = {};

  query.filters.forEach((filter) => {
    switch (filter.field) {
      case "catLevel1,catLevel2,catLevel3":
        // Find category by name
        const category = categoriesApi
          .getAll()
          .find((c) => c.name === filter.value);
        formValues.categoryId = category?.id?.toString();
        break;
      case "countryId":
        formValues.countryId = filter.value?.toString();
        break;
      case "location.state.id":
        if (!formValues.stateIds) formValues.stateIds = [];
        formValues.stateIds.push(filter.value?.toString());
        break;
      case "conditionType":
        if (filter.operation === Operation.IN && Array.isArray(filter.value)) {
          formValues.conditionTypes = filter.value;
        } else {
          formValues.conditionTypes = [filter.value?.toString()];
        }
        break;
      case "swapOptionType":
        if (filter.operation === Operation.IN && Array.isArray(filter.value)) {
          formValues.swapTypes = filter.value;
        } else {
          formValues.swapTypes = [filter.value?.toString()];
        }
        break;
      case "swapCategory":
        const swapCategory = categoriesApi
          .getAll()
          .find((c) => c.name === filter.value);
        formValues.swapCategoryId = swapCategory?.id?.toString();
        break;
    }
  });

  if (query.searchText) {
    formValues.searchInput = query.searchText;
  }

  return formValues;
};

// Helper function to convert ItemsFilterValues to Query
const formValuesToQuery = (data: ItemsFilterValues): Query => {
  const query: Query = { filters: [] };

  if (data.categoryId) {
    const category = categoriesApi.getById(data.categoryId);
    if (category) {
      query.filters?.push({
        field: "catLevel1,catLevel2,catLevel3",
        value: category.name,
        operation: Operation.EQUAL,
      });
    }
  }

  if (data.conditionTypes && data.conditionTypes.length > 0) {
    query.filters?.push({
      field: "conditionType",
      value: data.conditionTypes,
      operation: Operation.IN,
    });
  }

  if (data.countryId) {
    query.filters?.push({
      field: "countryId",
      value: data.countryId,
      operation: Operation.EQUAL,
    });
  }

  if (data.stateIds && data.stateIds.length > 0) {
    data.stateIds.forEach((stateId) => {
      query.filters?.push({
        field: "location.state.id",
        value: stateId,
        operation: Operation.EQUAL,
      });
    });
  }

  if (data.swapTypes && data.swapTypes.length > 0) {
    query.filters?.push({
      field: "swapOptionType",
      value: data.swapTypes,
      operation: Operation.IN,
    });

    if (data.swapCategoryId) {
      const swapCategory = categoriesApi.getById(data.swapCategoryId);
      if (swapCategory) {
        query.filters?.push({
          field: "swapCategory",
          value: swapCategory.name,
          operation: Operation.EQUAL,
        });
      }
    }
  }

  if (data.searchInput) {
    query.searchText = data.searchInput;
  }

  return query;
};

const ItemsFilter = ({
  defaultValues,
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
    if (openOnLoad) {
      setModalVisible(true);
    }
  }, [openOnLoad]);

  // Initialize form with default values when modal opens
  useEffect(() => {
    if (isModalVisible) {
      const formValues = queryToFormValues(defaultValues);
      reset(formValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible]);

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
    const query = formValuesToQuery(data);
    onChange(query);
    setModalVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const onFormError = (data: any) => {
    console.log(data);
  };

  const onBack = () => {
    const formValues = queryToFormValues(defaultValues);
    reset(formValues);
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
              placeholder={t("itemsFilter.searchInput.placeholder")}
              returnKeyType="next"
              returnKeyLabel="next"
              placeholderTextColor={theme.colors.grey}
              control={control}
              showReset
              hideLabel
            />
            {isCountryPickerVisible && (
              <Picker
                searchable
                placeholder={t("itemsFilter.country.placeholder")}
                name="countryId"
                items={countries}
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
