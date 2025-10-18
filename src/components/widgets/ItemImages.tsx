import { ImageSource, Item } from "@/api/itemsApi";
import constants from "@/config/constants";
import { produce } from "immer";
import React, { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { StyleSheet, View, ViewProps } from "react-native";
import ImagePicker from "./ImagePicker";

export const templateImage = { isTemplate: true, uri: "" };
interface ItemImagesProps extends ViewProps {
  name: string;
  templateSize?: number;
  onUploadStart?: (image: ImageSource) => void;
  onUploadFinish?: (image: ImageSource) => void;
  onUpload?: (uploading: boolean) => void;
  control: any;
  item?: Item;
  docId: string;
  onError?: (error: any) => void;
}
const tempImage = { isTemplate: true, uri: "" };
let tempImages = [tempImage, tempImage, tempImage];

const ItemImages = ({
  onUpload,
  onError,
  control,
  item,
  docId,
  name,
}: ItemImagesProps) => {
  const [images, setImages] = useState<ImageSource[]>([
    tempImage,
    tempImage,
    tempImage,
  ]);
  const uploadSet = useRef(new Set<string>()).current;

  const { field } = useController({
    control,
    defaultValue: undefined,
    name,
  });

  useEffect(() => {
    if (item && item.images && item.images.length > 0) {
      console.log(
        item.images.map((i) => ({
          isDefault: i.isDefault,
        }))
      );
      const updatedImages = Array.from(
        tempImages,
        (i) => ({ ...i } as ImageSource)
      );
      item.images.forEach((value, index) => {
        updatedImages[index] = value;
      });
      setImages(updatedImages);
    }
  }, [item, item?.images]);

  useEffect(() => {
    const filteredImages = images.filter((i) => !i.isTemplate);
    field.onChange(filteredImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const onAddImage = (imageSource: ImageSource, index: number) => {
    console.log("onAddImage index", index);
    setImages((currentImages) => {
      const updatedImages = produce(currentImages, (draftImages) => {
        draftImages[index] = imageSource;
      });
      return updatedImages;
    });
  };

  const onImageDelete = async (image: ImageSource) => {
    setImages((currentImages) => {
      const updatedImages = produce(currentImages, (draftImages) => {
        const index = currentImages.findIndex(
          (i) => !!image.downloadURL && i.downloadURL === image.downloadURL
        );
        draftImages[index] = { isTemplate: true, uri: "" };
      });
      return updatedImages;
    });
  };
  const onMarkAsDefault = (image: ImageSource) => {
    setImages((currentImages) => {
      const updatedImages = produce(currentImages, (draftImages) => {
        draftImages.forEach((i) => {
          i.isDefault = false;
        });
        const imageToUpdate = draftImages.find(
          (i) => i.downloadURL === image.downloadURL
        );
        if (imageToUpdate) {
          imageToUpdate.isDefault = true;
        }
        return draftImages;
      });
      return updatedImages;
    });
  };

  const onMaxSize = () => {
    const maxSizeParam = `${
      constants.firebase.MAX_IMAGE_SIZE / 1000 / 1000
    } MB`;
    if (onError) {
      onError({
        code: "storage/imageMaxSize",
        message: "imageMaxSize reached",
        type: "error",
        params: { maxSize: maxSizeParam },
      });
    }
  };

  const onUploadHandler = (
    image: ImageSource,
    status: "started" | "finished"
  ) => {
    if (onUpload && image) {
      status === "started"
        ? uploadSet.add(image?.name!)
        : uploadSet.delete(image?.name!);
      if (uploadSet.size > 0) {
        onUpload(true);
      } else {
        onUpload(false);
      }
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {images?.map((i, index) => (
          <ImagePicker
            key={index}
            source={i}
            name={"image" + index}
            control={control}
            onChange={(image) => onAddImage(image, index)}
            style={[
              styles.image,
              index === 0 || index === images?.length - 1
                ? null
                : styles.centerImage,
            ]}
            maxSize={constants.firebase.MAX_IMAGE_SIZE}
            onMaxSize={onMaxSize}
            onImageDelete={onImageDelete}
            onMarkAsDefault={onMarkAsDefault}
            onUpload={onUploadHandler}
            onError={(err) => console.log(err)}
            metadata={{ docId }}
            isDefault={i.isDefault}
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(ItemImages);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  image: {
    // flex: 1,
    // marginHorizontal: 5,
  },
  centerImage: {
    marginHorizontal: 10,
  },
  error: {
    marginTop: 10,
  },
});
