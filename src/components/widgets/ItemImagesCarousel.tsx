import React, { useCallback, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import CarouselBase, {
  ICarouselInstance,
  Pagination,
  TCarouselProps,
} from "react-native-reanimated-carousel";

import { ImageSource, Item } from "@/api/itemsApi";
import { theme } from "@/styles/theme";
import { useSharedValue } from "react-native-reanimated";
import { Icon, Modal, Text } from "../core";
import Card from "../core/Card";
import Image, { ImageProps } from "../core/Image";

type ItemImagesCarouselProps = Omit<
  TCarouselProps<ImageSource>,
  "data" | "renderItem"
> & {
  item: Item;
  contentFit?: ImageProps["contentFit"];
};

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
// Account for: screen padding (2x) + card padding (2x) + extra padding (2x)
const itemWidth = windowWidth - theme.defaults.SCREEN_PADDING * 6;

const ItemImagesCarousel = ({
  item,
  contentFit = "contain",
  style,
  ...props
}: ItemImagesCarouselProps) => {
  const progress = useSharedValue<number>(0);
  const fullScreenProgress = useSharedValue<number>(0);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [fullScreenActiveSlide, setFullScreenActiveSlide] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState(false);
  const ref = React.useRef<ICarouselInstance>(null);
  const fullScreenRef = React.useRef<ICarouselInstance>(null);

  const data = item.images;

  const renderItem: any = useCallback(
    (itemInfo: { item: ImageSource; index: number }) => {
      return (
        <>
          <Image
            uri={itemInfo.item.downloadURL!}
            style={styles.image}
            contentFit="cover"
          />
          {!!itemInfo?.item?.isDefault && (
            <Icon
              name="check-circle"
              color={theme.colors.green}
              style={styles.starIcon}
            />
          )}
        </>
      );
    },
    []
  );

  const renderFullScreenItem: any = useCallback(
    (itemInfo: { item: ImageSource; index: number }) => {
      return (
        <View style={styles.fullScreenImageContainer}>
          <Image
            uri={itemInfo.item.downloadURL!}
            style={styles.fullScreenImage}
            contentFit="contain"
          />
        </View>
      );
    },
    []
  );

  const onSnapToItem = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const onFullScreenSnapToItem = useCallback((index: number) => {
    setFullScreenActiveSlide(index);
  }, []);

  const onModalClose = () => setFullScreen(false);

  const openFullScreenModal = () => {
    setFullScreenActiveSlide(activeSlide);
    setFullScreen(true);
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const onPressFullScreenPagination = (index: number) => {
    fullScreenRef.current?.scrollTo({
      count: index - fullScreenProgress.value,
      animated: true,
    });
  };

  if (!item.images || item.images.length === 0) {
    return null;
  }

  return (
    <>
      <Card style={[styles.card, style]}>
        <CarouselBase
          {...props}
          data={data ?? []}
          snapEnabled={true}
          loop={false}
          width={itemWidth}
          height={250}
          renderItem={renderItem}
          onSnapToItem={onSnapToItem}
          style={styles.slideWrapper}
        />

        {!!data && data.length > 1 && (
          <Pagination.Basic
            data={data}
            progress={progress}
            // dotsLength={images.length}
            // activeDotIndex={activeSlide}
            containerStyle={styles.PaginationContainer}
            // dotContainerStyle={styles.dotContainer}
            dotStyle={styles.paginationActiveDot}
            // inactiveDotStyle={styles.paginationDot}
            // inactiveDotOpacity={0.4}
            // inactiveDotScale={0.6}
            onPress={onPressPagination}
          />
        )}
        <Icon
          name="fullscreen"
          size={30}
          style={styles.fullscreenIcon}
          onPress={openFullScreenModal}
        />
      </Card>

      {/* Fullscreen Image Modal */}
      <Modal
        isVisible={fullScreen}
        onClose={onModalClose}
        position="full"
        onBackdropPress={onModalClose}
        style={styles.fullScreenModal}
        containerStyle={styles.fullScreenModalContainer}
        bodyStyle={styles.fullScreenModalBody}
        hideCloseIcon
      >
        <Pressable style={styles.closeButton} onPress={onModalClose}>
          <Icon name="close" size={28} color={theme.colors.white} />
        </Pressable>

        <View style={styles.fullScreenCarouselWrapper}>
          <CarouselBase
            ref={fullScreenRef}
            data={data ?? []}
            snapEnabled={true}
            width={windowWidth}
            height={windowHeight * 0.75}
            renderItem={renderFullScreenItem}
            onSnapToItem={onFullScreenSnapToItem}
            onProgressChange={fullScreenProgress}
            defaultIndex={activeSlide}
          />
        </View>

        {!!data && data.length > 1 && (
          <View style={styles.fullScreenPaginationWrapper}>
            <Text style={styles.imageCounter}>
              {fullScreenActiveSlide + 1} / {data.length}
            </Text>
            <Pagination.Basic
              data={data}
              progress={fullScreenProgress}
              containerStyle={styles.fullScreenPaginationContainer}
              dotStyle={styles.fullScreenPaginationDot}
              activeDotStyle={styles.fullScreenPaginationActiveDot}
              onPress={onPressFullScreenPagination}
            />
          </View>
        )}
      </Modal>
    </>
  );
};

export default React.memo(ItemImagesCarousel);

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    paddingVertical: 20,
    paddingHorizontal: theme.defaults.SCREEN_PADDING,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    // padding: 5,
    // paddingTop: 10,
  },

  carouselContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'grey',
  },
  slideWrapper: {},
  image: {
    overflow: "hidden",
    width: "100%",
    aspectRatio: 1.1,
  },
  PaginationContainer: {
    padding: 0,
    marginTop: 10,
    // marginBottom: -30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // marginHorizontal: 8,
    backgroundColor: theme.colors.grey,
  },
  paginationActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.green,
  },
  modal: {
    // marginBottom: 30,
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 0,
  },
  fullscreenIcon: {
    position: "absolute",
    bottom: 1,
    left: 1,
    color: theme.colors.salmon,
  },
  SafeAreaView: {
    // position: 'absolute',
    height: 500,
    top: 0,
    flex: 1,
  },
  modalCarousel: {
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
  zoomableView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  fullScreenModal: {
    margin: 0,
  },
  fullScreenModalContainer: {
    backgroundColor: "#000000",
    paddingBottom: 0,
  },
  fullScreenModalBody: {
    flex: 1,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenCarouselWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  fullScreenPaginationWrapper: {
    paddingVertical: 20,
    alignItems: "center",
  },
  fullScreenPaginationContainer: {
    padding: 0,
  },
  fullScreenPaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  fullScreenPaginationActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.white,
  },
  imageCounter: {
    color: theme.colors.white,
    fontSize: 16,
    marginBottom: 10,
  },
});
