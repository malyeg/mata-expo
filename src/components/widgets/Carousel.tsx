import React, { useCallback, useState } from "react";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import CarouselBase, {
  CarouselProps as CarouselBaseProps,
  CarouselProperties,
  Pagination,
} from "react-native-snap-carousel";

import { ImageSource } from "@/api/itemsApi";
import theme from "@/styles/theme";
import ImageViewer from "react-native-image-zoom-viewer";
import { Icon, Image, Modal } from "../core";
import Card from "../core/Card";
import { ImageProps } from "../core/Image";

interface CarouselProps
  extends Omit<CarouselBaseProps<ImageSource>, "renderItem" | "data"> {
  images: ImageSource[];
  layout?: CarouselProperties<ImageSource>["layout"];
  renderItem?: CarouselBaseProps<ImageSource>["renderItem"];
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageProps["resizeMode"];
  viewImageInFullScreen?: boolean;
  onError?: (error?: string) => void;
}

const windowWidth = Dimensions.get("window").width;
const itemWidth = windowWidth - theme.defaults.SCREEN_PADDING * 4;
// const itemWidth = 100;
const itemHeight = itemWidth;

const Carousel = ({
  images,
  layout = "default",
  style,
  resizeMode = "contain",
  onError,
  renderItem,
}: CarouselProps) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [activeModalSlide, setActiveModalSlide] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState(false);

  const renderItemHandler: any = useCallback(
    (itemInfo: { item: ImageSource; index: number }) => {
      if (renderItem) {
        return renderItem(itemInfo);
      } else {
        return (
          <>
            <Image
              uri={itemInfo.item.downloadURL!}
              style={styles.image}
              resizeMode={resizeMode}
              onError={onError}
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
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resizeMode]
  );
  // const renderModalItemHandler: any = useCallback(
  //   (itemInfo: {item: ImageSource; index: number}) => (
  //     <ImageViewer
  //       style={styles.zoomableView}
  //       imageUrls={[{url: itemInfo.item.downloadURL!}]}
  //     />
  //   ),
  //   [],
  // );

  const onSnapToItem = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);
  const onModalSnapToItem = useCallback((index: number = 0) => {
    setActiveModalSlide(index);
  }, []);
  const onModalClose = useCallback(() => setFullScreen(false), []);

  const openModal = useCallback(() => setFullScreen(true), []);

  return (
    <>
      <Card style={[styles.card, style]}>
        {images.length === 1 ? (
          <Image
            source={{ uri: images[0].downloadURL }}
            resizeMode={resizeMode}
            onError={onError}
            onPress={onModalSnapToItem}
            style={styles.image}
          />
        ) : (
          <CarouselBase
            layout={layout}
            data={images}
            enableSnap={true}
            enableMomentum={true}
            sliderWidth={itemWidth}
            itemWidth={itemWidth}
            sliderHeight={itemHeight}
            itemHeight={itemHeight}
            renderItem={renderItemHandler}
            onSnapToItem={onSnapToItem}
            slideStyle={styles.slideWrapper}
          />
        )}

        {!!images && images.length > 0 && (
          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.PaginationContainer}
            // dotContainerStyle={styles.dotContainer}
            dotStyle={styles.paginationActiveDot}
            inactiveDotStyle={styles.paginationDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        )}
        <Icon
          name="fullscreen"
          size={30}
          style={styles.fullscreenIcon}
          onPress={openModal}
        />
      </Card>
      {fullScreen && (
        <Modal
          // style={styles.SafeAreaView}
          isVisible={fullScreen}
          onClose={onModalClose}
          position="full"
          containerStyle={styles.modal}
          showHeaderNav
          propagateSwipe={true}
        >
          <View style={styles.carouselContainer}>
            <ImageViewer
              backgroundColor="white"
              style={styles.zoomableView}
              imageUrls={images.map((i) => ({ url: i.downloadURL! }))}
            />
            {/* <CarouselBase
              layout="default"
              data={[...images]}
              style={styles.modalCarousel}
              loop={false}
              enableSnap={true}
              enableMomentum={true}
              containerCustomStyle={styles.modalCarousel}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width}
              renderItem={renderModalItemHandler}
              onSnapToItem={onModalSnapToItem}
            />
            <Pagination
              dotsLength={images.length}
              activeDotIndex={activeModalSlide}
              // containerStyle={styles.PaginationContainer}
              dotStyle={styles.paginationActiveDot}
              inactiveDotStyle={styles.paginationDot}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            /> */}
          </View>
        </Modal>
      )}
    </>
  );
};

export default React.memo(Carousel);

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    // padding: 50,
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
    flex: 1,
    width: "100%",
    // height: 100,
    // marginBottom: 20,
    // zIndex: 1,
  },
  imageFull: {
    flex: 1,
    // height: '100%',
    // width: '100%',
    // backgroundColor: 'grey',
  },
  PaginationContainer: {
    padding: 0,
    marginTop: -20,
    marginBottom: -30,
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
