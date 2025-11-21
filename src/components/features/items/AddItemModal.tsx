import { APIOptions } from "@/api/Api";
import categoriesApi from "@/api/categoriesApi";
import itemsApi, {
  ConditionType,
  ImageSource,
  Item,
  SwapType,
  swapTypes,
} from "@/api/itemsApi";
import { Location } from "@/api/locationApi";
import { Button, Modal } from "@/components/core";
import { CheckBox, Error, Picker, TextInput } from "@/components/form";
import ItemConditionPicker from "@/components/widgets/ItemConditionPicker";
import ItemImages from "@/components/widgets/ItemImages";
import Sheet from "@/components/widgets/Sheet";
import useApi from "@/hooks/useApi";
import useAppReview from "@/hooks/useAppReview";
import useAuth from "@/hooks/useAuth";
import useForm from "@/hooks/useForm";
import useLocale from "@/hooks/useLocale";
import useLocation from "@/hooks/useLocation";
import useSheet from "@/hooks/useSheet";
import useToast from "@/hooks/useToast";
import { Entity } from "@/types/DataTypes";
import Analytics from "@/utils/Analytics";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import * as yup from "yup";

type AddItemFormValues = {
  name: string;
  category: string;
  conditionType: ConditionType;
  usedWithIssuesDesc?: string;
  description?: string;
  location?: Location;
  images: ImageSource[];

  swapType: SwapType;
  swapCategory: string;
  status: boolean;
};
type AddItemModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AddItemModal = ({ isVisible, onClose }: AddItemModalProps) => {
  const { t } = useLocale("addItemScreen");

  const [swapType, setSwapType] = useState<SwapType | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [locationSelectorOpen, setLocationSelectorOpen] =
    useState<boolean>(false);
  const { show, sheetRef } = useSheet();
  const itemIdRef = useRef<string | undefined>(null);
  const { loader, request } = useApi();
  const { location } = useLocation();
  const { user, profile, addTargetCategory, getName } = useAuth();
  const { showSuccessToast, showErrorToast, hideToast } = useToast();
  const [currentItem, setCurrentItem] = useState<Item | undefined>();
  const [loading, setLoading] = useState(false);
  const [imagesError, setImagesError] = useState();
  const appreview = useAppReview();
  const router = useRouter();

  const { control, handleSubmit, reset, setValue, setFocus, formState } =
    useForm<AddItemFormValues>(
      {
        name: yup.string().trim().min(2).max(200).required(t("name.required")),
        category: yup.string().trim().required(t("category.required")),
        conditionType: yup.string().trim().required(t("status.required")),
        images: yup
          .array()
          .required(t("images.required"))
          .min(1, t("images.required")),
        description: yup.string().max(2000),
        location: yup.object().required(t("location.required")),

        usedWithIssuesDesc: yup.string().max(200),
        swapType: yup.string().required(t("swapType.required")),
        swapCategory: yup
          .string()
          .test("swapCategory", t("swapCategory.required"), function (value) {
            if (this.parent.swapType === ("swapWithAnother" as SwapType)) {
              return !!value;
            }
            return true;
          }),
      },
      {
        shouldFocusError: false,
        mode: "onBlur",
      }
    );

  const onFormError = async (data: any) => {
    console.log("onFormError", data);
  };

  const onFormSuccess = async (data: AddItemFormValues) => {
    try {
      hideToast();
      const invalidContent = itemsApi.getInvalidContent(
        data.name,
        data.description
      );
      if (invalidContent) {
        show({
          type: "alert",
          header: t("inappropriateContentWarning.header"),
          body: t("inappropriateContentWarning.body", {
            params: {
              content: JSON.stringify(invalidContent),
            },
          }),
        });
        return;
      }
      const defaultImage =
        data.images.find((i) => i.isDefault) ?? data.images[0];
      const item: Omit<Item, "id"> = {
        ...currentItem,
        name: data.name,
        category: categoriesApi.getAll().find((c) => c.id === data.category)!,
        condition: {
          type: data.conditionType,
        },
        description: data.description,
        images: data.images
          ?.filter((image) => !image.isTemplate)
          .map((image) => {
            const newImage = { ...image };
            delete newImage.uri;
            return newImage;
          }),
        defaultImageURL: defaultImage.downloadURL,
        location: data.location,
        userId: user.id,
        user: {
          id: user.id,
          name: getName(),
          email: profile?.email ?? user.username,
          isProfilePublic: profile?.isPublic ?? false,
        },
        status: data.status === true ? "draft" : "online",
        swapOption: {
          type: data.swapType,
        },
      };
      !!data.swapCategory &&
        (item.swapOption.category = categoriesApi
          .getAll()
          .find((c) => c.id === data.swapCategory));
      !!data.usedWithIssuesDesc &&
        (item.condition.desc = data.usedWithIssuesDesc);

      const options: APIOptions = {
        analyticsEvent: {
          disabled: true,
        },
      };

      const savedItem = await request<Item>(() => {
        return itemsApi.set(itemIdRef.current!, item as Item, options);
      });
      Analytics.logEvent(currentItem ? "update_item" : "add_item", {
        category: savedItem.category.name,
      });
      !!item?.swapOption.category &&
        addTargetCategory(item?.swapOption.category.id!);

      reset();
      router.navigate({
        pathname: "/items/[id]",
        params: { id: savedItem.id },
      });

      appreview.requestInAppReview();
      showSuccessToast(
        currentItem ? t("editItemSuccess") : t("addItemSuccess")
      );
    } catch (err: any) {
      showErrorToast(err);
    }
  };

  const onUploadHandler = useCallback((isUploading: boolean) => {
    setUploading(isUploading);
  }, []);

  const onSwapChange = useCallback((value: string) => {
    setSwapType(value as SwapType);
  }, []);
  const onLocationModalChange = useCallback((status: "opened" | "closed") => {
    // setSwapType(value as SwapType);
    status === "opened"
      ? setLocationSelectorOpen(true)
      : setLocationSelectorOpen(false);
  }, []);

  const categories = useMemo(() => categoriesApi.getAll(), []);
  const focusToDiscription = () => setFocus("description");
  return (
    <Modal
      isVisible={isVisible}
      position="full"
      title="Add Item"
      showHeaderNav
      onClose={onClose}
      hideCloseIcon={false}
      bodyStyle={{
        flex: 1,
        justifyContent: "space-evenly",
        // alignItems: "center",
      }}
    >
      <ItemImages
        name="images"
        templateSize={3}
        onUpload={onUploadHandler}
        control={control}
        item={currentItem}
        docId={itemIdRef.current!}
        onError={setImagesError}
      />
      {formState.errors.images && (
        <Error
          style={styles.imagesError}
          error={imagesError ?? formState.errors.images}
        />
      )}

      <TextInput
        name="name"
        placeholder={t("name.placeholder")}
        returnKeyType="next"
        control={control}
        onSubmitEditing={focusToDiscription}
        hideLabel
        defaultValue={currentItem?.name}
      />

      <TextInput
        name="description"
        multiline
        numberOfLines={2}
        placeholder={t("description.placeholder")}
        returnKeyType="next"
        control={control}
        hideLabel
        defaultValue={currentItem?.description}
      />

      <Picker
        name="category"
        items={categories}
        searchable
        placeholder={t("category.placeholder")}
        modalTitle={t("category.modalTitle")}
        control={control}
        multiLevel
        hideLabel
        defaultValue={currentItem?.category?.id.toString()}
      />

      <ItemConditionPicker
        name="conditionType"
        control={control}
        defaultValue={currentItem?.condition.type}
      />

      <Picker
        position="bottom"
        name="swapType"
        items={swapTypes as Entity[]}
        placeholder={t("swapType.placeholder")}
        modalTitle={t("swapType.modalTitle")}
        control={control}
        onChange={onSwapChange}
        hideLabel
        defaultValue={currentItem?.swapOption.type}
      />

      {swapType === "swapWithAnother" && (
        <Picker
          name="swapCategory"
          searchable
          items={categories}
          placeholder={t("swapCategory.placeholder")}
          modalTitle={t("swapCategory.modalTitle")}
          control={control}
          multiLevel
          hideLabel
          defaultValue={currentItem?.swapOption.category?.id}
        />
      )}

      {/* <LocationSelector
        style={styles.location}
        control={control}
        defaultValue={currentItem ? currentItem?.location : location}
        onModalChange={onLocationModalChange}
      /> */}
      <CheckBox
        style={styles.draftCheckBox}
        control={control}
        name="status"
        label={t("status.saveAsDraftLabel")}
        defaultValue={currentItem?.status === "draft"}
      />

      <Button
        title={!currentItem ? t("addBtnTitle") : t("updateBtnTitle")}
        disabled={uploading}
        onPress={handleSubmit(onFormSuccess, onFormError)}
      />

      {loader}
      <Sheet ref={sheetRef} />
    </Modal>
  );
};

export default AddItemModal;

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    // flex: 1,
    justifyContent: "space-evenly",
    // paddingBottom: 10,
  },
  imagesContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  location: {
    marginTop: 5,
  },
  radioGroup: {
    justifyContent: "space-between",
    paddingRight: "20%",
  },
  draftCheckBox: {
    marginBottom: 15,
  },
  imagesError: {
    marginTop: 5,
  },
});
