import { Item } from "@/api/itemsApi";
import constants from "@/config/constants";
import useLocation from "@/hooks/useLocation";
import theme from "@/styles/theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Carousel from "react-native-reanimated-carousel";
import MapItem from "./MapItem";
import MapItemCard, { MAP_CARD_HEIGHT } from "./MapItemCard";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const EDGE_PADDING = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};

interface ItemsMapViewProps {
  items: Item[];
  onLoadMore?: () => void;
  showLoadMore?: boolean;
  onSelectItem?: (item: Item) => void;
}
const ItemsMapView = ({ items, onSelectItem }: ItemsMapViewProps) => {
  const mapRef = useRef<MapView | null>(null);
  const { location } = useLocation();
  const [selectedItem, setSelectedItem] = useState<Item>(items[0]);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    const region = selectedItem?.location?.coordinate;
    console.log("animateToCoordinate;");
    mapRef.current?.animateCamera({
      altitude: region?.latitude!,
      // center:
      // alatitude: region?.latitude!,
      // longitude: region?.longitude!,
    });
  }, [selectedItem]);

  const fitToMarkers = useCallback(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      mapRef.current?.fitToElements({
        edgePadding: EDGE_PADDING,
      });
    }
  }, []);

  const onSnapToItem = (index: number) => {
    setSelectedItem(items[index]);
  };

  const renderCard = (itemInfo: { item: Item; index: number }) => (
    <MapItemCard item={itemInfo.item} onPress={onSelectItem} />
  );
  return (
    <View style={styles.container}>
      <MapView
        ref={(ref) => {
          mapRef.current = ref as MapView;
        }}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        zoomEnabled={true}
        maxZoomLevel={13}
        showsCompass={false}
        showsBuildings={false}
        showsIndoors={false}
        toolbarEnabled={false}
        showsUserLocation={false}
        onMapLoaded={fitToMarkers}
        initialRegion={{
          ...constants.maps.DEFAULT_LOCATION,
          ...location?.coordinate,
        }}
        // onRegionChangeComplete={onRegionChangeComplete}
      >
        {items.map((item) => (
          <MapItem
            style={
              item?.id.toString() === selectedItem?.id?.toString()
                ? styles.focused
                : {}
            }
            selected={item?.id.toString() === selectedItem?.id?.toString()}
            key={item.id}
            item={item}
            onSelectMarker={onSelectItem}
          />
        ))}
      </MapView>
      {/* {showLoadMore && (
        <Button
          title="Show more"
          style={styles.showMoreBtn}
          onPress={onLoadMore}
        />
      )} */}
      <View style={styles.itemsContainer}>
        <Carousel
          data={items}
          enableSnap={true}
          // enableMomentum={true}
          width={SCREEN_WIDTH}
          height={MAP_CARD_HEIGHT}
          // itemWidth={MAP_CARD_WIDTH}
          // sliderHeight={MAP_CARD_HEIGHT}
          // itemHeight={MAP_CARD_HEIGHT}
          renderItem={renderCard}
          onSnapToItem={onSnapToItem}
          // slideStyle={styles.slideWrapper}
        />
      </View>
    </View>
  );
};

export default ItemsMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  itemsContainer: {
    position: "absolute",
    bottom: 0,
  },
  map: {
    flex: 1,
  },
  marker: {},
  markerImage: {
    // flex: 1,
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemSeparator: {
    width: 10,
  },
  bubble: {
    backgroundColor: theme.colors.white,
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 5,
    // width: 200,
  },
  focused: {
    zIndex: 100,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: theme.colors.white,
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: theme.colors.white,
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  tipName: {
    flexWrap: "wrap",
  },
  showMoreBtn: {
    marginHorizontal: theme.defaults.SCREEN_PADDING,
  },
  chevron: {
    top: SCREEN_HEIGHT / 2 - 20,
    color: theme.colors.salmon,
    fontSize: 50,
    backgroundColor: "rgba(00, 00, 00, 0.2)",
    zIndex: 1,
  },
  rightChevron: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2 - 20,
    right: 0,
  },
  leftChevron: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2 - 20,
    left: 0,
  },
});
