import itemsApi, { ImageMetadata, ImageSource } from "@/api/itemsApi";
import useAuth from "@/hooks/useAuth";
import useController from "@/hooks/useController";
import useLocale from "@/hooks/useLocale";
import useMountedRef from "@/hooks/useMountRef";
import { theme } from "@/styles/theme";
import { TaskEvent } from "@react-native-firebase/storage";
import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";
import * as ImagePickerBase from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import { Icon, Image, Modal, Separator } from "../core";
import ListItem from "../core/ListItem";
import PressableOpacity from "../core/PressableOpacity";

export interface ItemImageProps extends ViewProps {
  name: string;
  control: any;
  source?: ImageSource;
  maxSize?: number;
  defaultValue?: string;
  disabled?: boolean;
  deletable?: boolean;
  onChange: (imageSource: ImageSource) => void;
  onMaxSize?: (maxSize: number, fileSize: number) => void;
  onImageDelete?: (imageSource: ImageSource) => Promise<void>;
  onMarkAsDefault?: (imageSource: ImageSource) => void;
  onPress?: () => boolean | void;
  onUpload?: (
    imageSource: ImageSource,
    status: "started" | "finished"
  ) => boolean | void;
  onError?: (error?: any) => void;
  isDefault?: boolean;
  metadata: ImageMetadata;
}

const options: ImagePickerBase.ImageLibraryOptions = {
  mediaType: "photo",
  maxHeight: 1000,
  maxWidth: 1000,
};

const ImagePicker: FC<ItemImageProps> = ({
  name,
  control,
  source,
  maxSize,
  onChange,
  onMaxSize,
  onImageDelete,
  onMarkAsDefault,
  onUpload,
  onError,
  defaultValue,
  disabled = false,
  deletable = true,
  onPress,
  metadata,
  isDefault,
  ...props
}) => {
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const mounted = useMountedRef();
  const { t } = useLocale("common");
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const { field } = useController({
    control,
    defaultValue,
    name,
  });
  useEffect(() => {
    let uri = source?.uri ?? source?.downloadURL;
    const newSource = { ...source, uri };
    if (mounted.current && !!newSource) {
      // setImageSource(newSource);
      field.onChange(newSource);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const openGallery = () => {
    if (disabled) {
      return;
    }
    if (onPress && onPress() === false) {
      return;
    }
    if (field.value && !field.value.isTemplate) {
      setModalVisible(true);
      return;
    }
    ImagePickerBase.launchImageLibrary(options, uploadCallback);
  };

  const upload = async (asset: ImagePickerBase.Asset) => {
    const imageSource: ImageSource = {
      name: asset.fileName,
      type: asset.type,
      uri: asset.uri!,
      size: asset.fileSize,
      width: asset.width,
      height: asset.height,
      metadata,
    };
    const resizedImage = await resizeImage(imageSource);

    if (!resizedImage) {
      console.log("resizedImage empty", resizedImage);
      return;
    }
    if (onUpload) {
      onUpload(resizedImage!, "started");
    }
    const task = itemsApi.upload(user.id, resizedImage!);
    let bytesTransferred = 0;
    task.on(
      TaskEvent.STATE_CHANGED,
      (snapshot) => {
        if (bytesTransferred !== snapshot.bytesTransferred) {
          console.debug("bytesTransferred", snapshot.bytesTransferred);
          bytesTransferred = snapshot.bytesTransferred;
        }
      },
      (error) => {
        console.log(error);
        if (onError) {
          onError(error);
        }
        setUploading(false);
        if (onUpload) {
          onUpload(imageSource, "finished");
        }
      },
      async () => {
        let newImageSource: ImageSource | null = null;
        try {
          let downloadURL = await task.snapshot?.ref.getDownloadURL();
          if (downloadURL?.includes("?")) {
            downloadURL =
              downloadURL.substr(0, downloadURL.indexOf("?")) + "?alt=media";
          }
          newImageSource = {
            ...resizedImage,
            uri: resizedImage?.uri!,
            isTemplate: false,
            downloadURL,
            filePath: task.snapshot?.ref.fullPath,
          };
          await task.snapshot?.ref.updateMetadata({
            customMetadata: {
              ...metadata,
              docId: metadata.docId,
            },
          });
          onChange(newImageSource);
          field.onChange(newImageSource);
        } catch (error) {
          console.log(error);
          onError && onError(error);
        } finally {
          setUploading(false);
          if (onUpload) {
            onUpload(newImageSource ?? imageSource, "finished");
          }
        }
      }
    );
  };

  const resizeImage = async (image: ImageSource) => {
    try {
      const response = await ImageResizer.createResizedImage(
        image.uri!,
        600,
        600,
        "JPEG",
        100,
        0,
        undefined,
        false,
        { mode: "contain", onlyScaleDown: true }
      );
      if (maxSize && onMaxSize && response.size > maxSize) {
        onMaxSize(maxSize, response.size);
        const error = new Error(`max size (${maxSize}) reached`);
        (error as any).code = "storage/imageMaxSize";
        throw error;
      }
      return { ...image, ...response } as ImageSource;
    } catch (error) {
      onError && onError(error);
      throw error;
    }
  };

  const uploadCallback = (response: any) => {
    setOptionsModalVisible(false);
    if (response.didCancel) {
      return;
    } else if (response.errorCode) {
      console.log(
        "ImagePicker Error: ",
        response.errorCode,
        response.errorMessage
      );
    }
    if (response.assets && response.assets.length > 0) {
      setUploading(true);
      upload(response.assets[0]).catch(() => {
        console.log("upload catch");
        setUploading(false);
      });
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const closeOptionsModal = () => {
    setOptionsModalVisible(false);
  };

  const deleteImage = async () => {
    if (onImageDelete && field.value) {
      await onImageDelete(field.value);
      field.onChange(undefined);
    }
    setModalVisible(false);
  };

  const markAsDefault = () => {
    if (onMarkAsDefault && field.value) {
      onMarkAsDefault(field.value);
    }
    setModalVisible(false);
  };
  const showOptions = () => {
    setOptionsModalVisible(true);
  };

  const openCamera = async () => {
    console.log("openCamera");
    const results = await ImagePickerBase.launchCamera(
      {
        mediaType: "photo",
      },
      uploadCallback
    );
    if (results.assets && results.assets.length > 0) {
      upload(results.assets[0]);
    }
  };

  return (
    <>
      <PressableOpacity
        activeOpacity={disabled ? 1 : undefined}
        onPress={showOptions}
        style={[styles.container, props.style]}
      >
        {!!field.value && !field.value?.isTemplate ? (
          <Image source={field.value} style={styles.image} />
        ) : (
          <Icon style={styles.addIcon} name="plus" color="white" size={25} />
        )}
        {!!uploading && (
          <View style={styles.uploading}>
            <ActivityIndicator size="large" color={theme.colors.dark} />
          </View>
        )}
        {!!isDefault && (
          <Icon
            name="check-circle"
            color={theme.colors.green}
            style={styles.starIcon}
          />
        )}
      </PressableOpacity>

      <Modal
        position="bottom"
        onClose={closeModal}
        isVisible={isModalVisible}
        title={t("imagePicker.imageAction")}
      >
        <View style={styles.modalContainer}>
          {deletable && (
            <ListItem
              text={t("imagePicker.deleteText")}
              icon="trash-can-outline"
              iconColor={theme.colors.salmon}
              onPress={deleteImage}
            />
          )}
          <Separator />
          <ListItem
            text={t("imagePicker.markAsDefaultText")}
            style={styles.modalItem}
            icon="check-circle"
            iconColor={theme.colors.green}
            onPress={markAsDefault}
          />
        </View>
      </Modal>
      <Modal
        position="bottom"
        onBackdropPress={() => null}
        onClose={closeOptionsModal}
        isVisible={optionsModalVisible}
        title={t("imagePicker.optionsModal.title")}
      >
        <View style={styles.modalContainer}>
          <ListItem
            text={t("imagePicker.optionsModal.galleryText")}
            icon="camera-image"
            iconColor={theme.colors.salmon}
            onPress={openGallery}
          />
          <Separator />
          <ListItem
            text={t("imagePicker.optionsModal.cameraText")}
            icon="camera"
            iconColor={theme.colors.salmon}
            onPress={openCamera}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderColor: theme.colors.grey,
    borderWidth: 0.5,
    backgroundColor: theme.colors.lightGrey,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
  },
  addIcon: {
    color: theme.colors.grey,
  },

  uploading: {
    position: "absolute",
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flex: 1,
  },
  statusText: {
    // marginTop: 20,
    fontSize: 10,
  },

  // Modal styles
  modalContainer: {
    paddingBottom: 50,
  },
  safeAreaContainer: {
    flex: 0.5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 30,
    paddingTop: 30,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  headerContainer: {
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
  modalItem: {
    // backgroundColor: 'grey',
  },
  starIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "white",
    borderRadius: 10,
    fontSize: 20,
  },
});

export default React.memo(ImagePicker);
