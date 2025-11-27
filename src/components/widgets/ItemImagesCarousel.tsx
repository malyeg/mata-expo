import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import CarouselBase, {
  ICarouselInstance,
  Pagination,
  TCarouselProps,
} from "react-native-reanimated-carousel";

import { ImageSource, Item } from "@/api/itemsApi";
import { theme } from "@/styles/theme";
import { useSharedValue } from "react-native-reanimated";
import { Icon } from "../core";
import Card from "../core/Card";
import Image, { ImageProps } from "../core/Image";

type ItemImagesCarouselProps = Omit<
  TCarouselProps<ImageSource>,
  "data" | "renderItem"
> & {
  item: Item;
  resizeMode?: ImageProps["resizeMode"];
};

const windowWidth = Dimensions.get("window").width;
// Account for: screen padding (2x) + card padding (2x) + extra padding (2x)
const itemWidth = windowWidth - theme.defaults.SCREEN_PADDING * 6;

const ItemImagesCarousel = ({
  item,
  resizeMode = "contain",
  style,
  ...props
}: ItemImagesCarouselProps) => {
  const progress = useSharedValue<number>(0);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState(false);
  const ref = React.useRef<ICarouselInstance>(null);

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

    [resizeMode]
  );

  const onSnapToItem = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const onModalClose = useCallback(() => setFullScreen(false), []);

  const openModal = useCallback(() => setFullScreen(true), []);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
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
          onPress={openModal}
        />
      </Card>
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
});
