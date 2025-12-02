import locationApi, { Location } from "@/api/locationApi";
import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
} from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { Icon } from "../core";

const defaultQuery: {
  components: string;
  language?: string;
} = {
  language: "en",
  components: "country:nz", // TODO set country from profile if exists
};
interface LocationSearchProps extends ViewProps {
  initialLocation?: Location;
  textStyle?: TextStyle;
  onChange: (location: Location) => void;
  query?: {
    countryCode?: string;
    language?: string;
  };
}
const LocationSearch: FC<LocationSearchProps> = ({
  onChange,
  initialLocation,
  style,
  textStyle,
  query,
}) => {
  const ref = useRef<any>(null);
  const { t } = useLocale("common");
  const [listViewDisplayed, setListViewDisplayed] = useState<boolean | "auto">(
    "auto"
  );
  const apiKey =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY
      : process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY;

  useEffect(() => {
    if (!!initialLocation && !!initialLocation.address?.name) {
      ref.current?.setAddressText(initialLocation.address.name);
    }
  }, [initialLocation]);

  const setLocation = async (
    _data: GooglePlaceData,
    detail: GooglePlaceDetail | null
  ) => {
    if (detail) {
      const newLoc = await locationApi.buildLocationFromPlace(detail);
      onChange(newLoc);
      setListViewDisplayed(false);
      Keyboard.dismiss();
    }
  };

  const onPressCurrentLocation = async () => {
    if (await locationApi.hasPermission()) {
      const location = await locationApi.getCurrentLocation();
      if (location) {
        ref.current?.setAddressText(location.address?.name);
        onChange(location);
      }
    }
  };

  const clear = () => {
    ref.current?.setAddressText("");
  };

  const IconsComponent = () => (
    <View style={styles.iconsContainer}>
      <Icon
        name="close"
        size={20}
        color={theme.colors.grey}
        style={styles.icon}
        onPress={clear}
      />
      <Icon
        name="crosshairs-gps"
        size={20}
        color={theme.colors.grey}
        style={styles.icon}
        onPress={onPressCurrentLocation}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        styles={{
          container: { ...styles.inputContainer, ...(style as {}) },
          textInput: { ...styles.textInput, ...(textStyle as {}) },
          listView: styles.listView,
        }}
        placeholder={t("search")}
        fetchDetails={true}
        onPress={setLocation}
        query={{
          key: apiKey,
          components:
            "country:" +
            (query?.countryCode?.toLowerCase() ?? defaultQuery.components),
          language: query?.language ?? defaultQuery.language,
        }}
        debounce={1000}
        renderRightButton={IconsComponent}
        keyboardShouldPersistTaps="handled"
        listViewDisplayed={listViewDisplayed}
        textInputProps={{
          clearButtonMode: "never",

          onFocus: () => setListViewDisplayed("auto"),
        }}
      />
    </View>
  );
};

export default React.memo(LocationSearch);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0,
  },
  listView: {
    zIndex: 1000,
  },
  label: {
    color: theme.colors.grey,
  },
  iconsContainer: {
    zIndex: 2000,
    flexDirection: "row",
    position: "absolute",
    alignSelf: "center",
    // backgroundColor: 'grey',
    right: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  textInput: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.medium,
    height: 50,
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    color: theme.colors.dark,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingEnd: 60,
  },
});
