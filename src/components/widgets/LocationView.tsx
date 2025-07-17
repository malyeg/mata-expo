import { Location } from "@/api/locationApi";
import constants from "@/config/constants";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const summaryDelta = {
  latitudeDelta: 1,
  longitudeDelta: 1,
};

interface LocationViewProps {
  location: Location;
  style: StyleProp<ViewStyle>;
}
const LocationView = ({ location, style }: LocationViewProps) => {
  return (
    <View style={style}>
      <MapView
        // ref={mapSummaryRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        zoomEnabled={false}
        scrollEnabled={false}
        showsUserLocation={false}
        initialRegion={constants.maps.DEFAULT_LOCATION}
        region={{
          ...location.coordinate,
          ...summaryDelta,
        }}
      >
        <Marker coordinate={location.coordinate} />
      </MapView>
    </View>
  );
};

export default LocationView;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    marginTop: 20,
    // height: 200,
    // backgroundColor: 'grey',
    // zIndex: 1,
  },
});
