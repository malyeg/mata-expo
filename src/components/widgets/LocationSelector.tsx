import React, { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View, ViewProps } from "react-native";
import MapView, { MapEvent, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Modal from 'react-native-modal';
import locationApi, { Coordinate, Location } from "@/api/locationApi";
import constants from "@/config/constants";
import useAuth from "@/hooks/useAuth";
import useController from "@/hooks/useController";
import useLocale from "@/hooks/useLocale";
import { useImmer } from "use-immer";
import { Button, Modal } from "../core";
import { Error, KeyboardView } from "../form";
import LocationSearch from "./LocationSearch";

const summaryDelta = {
  latitudeDelta: 1,
  longitudeDelta: 1,
};
const detailsDelta = {
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

interface LocationSelectorProps extends ViewProps {
  control: any;
  name?: string;
  defaultValue?: Location;
  onChange?: (location: Location) => void;
  onModalChange?: (status: "opened" | "closed") => void;
  initialRegion?: Coordinate;
  summaryLocationDelta?: { latitudeDelta: number; longitudeDelta: number };
}
const LocationSelector = ({
  name = "location",
  onChange,
  style,
  defaultValue,
  onModalChange,
  initialRegion,
  control,
  summaryLocationDelta,
}: LocationSelectorProps) => {
  const { t } = useLocale("common");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [location, setLocation] = useImmer<Location>(defaultValue!);
  const mapSummaryRef = useRef<any>(null);
  const mapDetailsRef = useRef<any>(null);
  const { profile } = useAuth();
  const { bottom } = useSafeAreaInsets();

  const { field, formState } = useController({
    control,
    name,
    defaultValue,
  });

  const openModal = () => {
    setModalVisible(true);
    if (onModalChange) {
      onModalChange("opened");
    }
  };
  const closeModal = () => {
    setModalVisible(false);
    if (onModalChange) {
      onModalChange("closed");
    }
  };
  const onConfirm = async () => {
    let loc = await locationApi.getLocationFrom(location.coordinate);
    if (!loc) {
      loc = { ...location };
    }
    field.value = loc;
    field.onChange(loc);
    updateMap(loc.coordinate, "summary");
    if (onChange) {
      onChange(loc);
    }
    setModalVisible(false);
    if (onModalChange) {
      onModalChange("closed");
    }
  };
  const onSelectMarker = (
    event: MapEvent<{
      placeId?: string;
      name?: string;
    }>
  ) => {
    onSelectLocation(event);
  };

  const onSelectLocation = async (
    event: MapEvent<{
      placeId?: string;
      name?: string;
    }>
  ) => {
    const loc = await locationApi.getLocationFrom(event.nativeEvent.coordinate);
    if (loc) {
      setLocation(loc);
      updateMap(loc.coordinate, "details");
    }
    // TODO handle null loc
  };
  const onSelectPlace = (loc: Location) => {
    const newCords: Coordinate = {
      latitude: loc.coordinate.latitude,
      longitude: loc.coordinate.longitude,
      ...summaryDelta,
    };
    updateMap(newCords, "details");
    setLocation(loc);
  };
  const updateMap = (coords: Coordinate, type: "summary" | "details") => {
    const ref = type === "details" ? mapDetailsRef : mapSummaryRef;

    const delta = type === "details" ? detailsDelta : summaryDelta;
    ref.current.fitToSuppliedMarkers({ ...coords, ...delta });
    ref.current.animateToRegion({ ...coords, ...delta }, 1000);
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.map} onPress={openModal}>
        <MapView
          ref={mapSummaryRef}
          onPress={openModal}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          zoomEnabled={false}
          scrollEnabled={false}
          showsUserLocation={false}
          rotateEnabled={false}
          zoomControlEnabled={false}
          toolbarEnabled={false}
          zoomTapEnabled={false}
          pitchEnabled={false}
          region={
            location
              ? {
                  ...location.coordinate,
                  ...detailsDelta,
                  ...summaryLocationDelta,
                }
              : undefined
          }
          initialRegion={
            initialRegion
              ? { ...constants.maps.DEFAULT_LOCATION, ...initialRegion }
              : undefined
          }
        >
          {!!location?.coordinate && (
            <Marker coordinate={location.coordinate} />
          )}
        </MapView>
      </Pressable>
      {formState.errors[name] && <Error error={formState.errors[name]} />}
      <Modal
        position="full"
        title={t("location.title")}
        isVisible={isModalVisible}
        onClose={closeModal}
        bodyStyle={styles.modalContainer}
        showHeaderNav
        containerStyle={{ paddingBottom: 0 }}
        propagateSwipe
      >
        <LocationSearch
          style={styles.search}
          initialLocation={location}
          onChange={onSelectPlace}
          query={{
            countryCode: location?.country?.code ?? profile?.country?.code,
          }}
        />
        <MapView
          ref={mapDetailsRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          zoomEnabled={true}
          scrollEnabled={true}
          toolbarEnabled={true}
          // showsMyLocationButton={true}
          showsUserLocation={true}
          initialRegion={
            location?.coordinate
              ? {
                  ...location?.coordinate,
                  ...detailsDelta,
                }
              : initialRegion
              ? {
                  ...constants.maps.DEFAULT_LOCATION,
                  ...initialRegion,
                  ...summaryLocationDelta,
                }
              : { ...constants.maps.DEFAULT_LOCATION, ...summaryLocationDelta }
          }
          // zoomControlEnabled={true}
          zoomTapEnabled={true}
          onPress={onSelectLocation}
          onPoiClick={onSelectMarker}
        >
          {!!location?.coordinate && (
            <Marker
              coordinate={location.coordinate}
              // title={location.address?.name}
            />
          )}
        </MapView>
        <KeyboardView
          style={[
            styles.confirmButtonContainer,
            {
              marginBottom: bottom,
            },
          ]}
        >
          <Button title="confirm" onPress={onConfirm} />
        </KeyboardView>
      </Modal>
    </View>
  );
};

export default React.memo(LocationSelector);

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
  },
  modalContainer: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  search: {
    marginHorizontal: 15,
  },
  map: {
    flex: 1,
  },
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: "flex-end",
  },
  confirmButtonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 3000,
    paddingHorizontal: 20,
  },
});
