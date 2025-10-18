import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import React, { useCallback, useState } from "react";
import { ImageStyle, StyleProp, StyleSheet } from "react-native";
import Modal from "./Modal";
export interface ImageProps {
  uri?: string;
  source?: any;
  cache?: "immutable" | "web" | "cacheOnly";
  style?: StyleProp<ImageStyle>;
  resizeMode?: ExpoImageProps["resizeMode"];
  contentFit?: ExpoImageProps["contentFit"];
  onPress?: () => void;
  onPressViewInFullScreen?: boolean;
  onError?: (error?: string) => void;
}

// const placeholder = require('@/assets/images/placeholder.png');
// https://blog.logrocket.com/caching-images-react-native-tutorial-with-examples/
// const defaultCache = FastImage.cacheControl.immutable;
const Image = ({
  style,
  source,
  resizeMode,
  uri,
  onPress,
  onPressViewInFullScreen = false,
  onError,
  ...props
}: ImageProps) => {
  const [isVisible, setVisible] = useState(false);
  const styleList = [styles.image, style];

  const showModal = useCallback(() => {
    if (onPress) {
      onPress();
    } else if (onPressViewInFullScreen) {
      setVisible(true);
    }
  }, [onPress, onPressViewInFullScreen]);

  const closeModal = () => setVisible(false);
  return (
    <>
      <ExpoImage
        {...props}
        style={[styleList]}
        source={
          source ?? {
            uri,
          }
        }
        onTouchStart={showModal}
      />
      <Modal
        isVisible={isVisible}
        onClose={closeModal}
        position="full"
        showHeaderNav
      >
        <ExpoImage
          {...props}
          style={styles.fullScreenImage}
          source={
            source ?? {
              uri,
            }
          }
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    // width: 100,
    // height: 100,
  },
  fullScreenImage: {
    height: "100%",
    width: "100%",
  },
  // fullScreen:
});

export default React.memo(Image);
