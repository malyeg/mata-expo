import { Item } from "@/api/itemsApi";
import theme from "@/styles/theme";
import { BaseViewProps } from "@/types/ReactTypes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { Text } from "../core";

interface MapItemProps extends BaseViewProps {
  item: Item;
  onSelectMarker?: (item: Item) => void;
  selected?: boolean;
}
const MapItem = ({ item, onSelectMarker, selected, style }: MapItemProps) => {
  const onPressMarker = () => {
    console.log("marker");
    !!onSelectMarker && onSelectMarker(item);
  };

  return (
    <Marker
      key={item.id.toString()}
      identifier={item.id.toString()}
      tracksViewChanges={true}
      style={style}
      onPress={onPressMarker}
      coordinate={item.location?.coordinate!}
    >
      <View style={styles.outerView}>
        {selected ? (
          <View style={[styles.innerView, styles.innerViewSelected]}>
            <Text style={styles.emptyTextSelected}>.</Text>
          </View>
        ) : (
          <View style={[styles.innerView, styles.innerViewNotSelected]}>
            <Text style={styles.emptyTextNotSelected}>s</Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

export default React.memo(MapItem);

const styles = StyleSheet.create({
  outerView: {
    width: 30,
    height: 30,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  innerView: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  innerViewSelected: {
    backgroundColor: theme.colors.salmon,
  },
  innerViewNotSelected: {
    backgroundColor: theme.colors.dark,
  },
  emptyTextSelected: {
    color: theme.colors.salmon,
  },
  emptyTextNotSelected: {
    color: theme.colors.dark,
  },

  markerImage: {
    // flex: 1,
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
  },
  bubble: {
    backgroundColor: theme.colors.white,
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 5,
    // width: 200,
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
});
