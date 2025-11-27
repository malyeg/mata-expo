import { Country, State } from "@/models/place.model";
import Geocoder from "@/utils/Geocoder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoLocation from "expo-location";
import Analytics from "../utils/Analytics";
import { LoggerFactory } from "../utils/logger";
import citiesApi, { City } from "./citiesApi";
import countriesApi from "./countriesApi";
import crashlyticsApi from "./CrashlyticsApi";

// Local types to replace react-native-google-places-autocomplete types
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GooglePlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface GooglePlaceDetail {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: GooglePlaceGeometry;
  place_id: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface Location {
  coordinate: Coordinate;
  address?: {
    name: string;
    formattedAddress: string;
  };
  city?: City;
  state?: State;
  country?: Country;
  placeId?: string;
  position?: { x: number; y: number };
  provider?: "SIM" | "GPS" | "INTERNET";
}

// Location options configuration
const locationOptions: ExpoLocation.LocationOptions = {
  accuracy: ExpoLocation.Accuracy.Balanced,
  timeInterval: 60000,
  distanceInterval: 100,
};

const logger = LoggerFactory.getLogger("LocationApi");

class LocationApi {
  private watchSubscription: ExpoLocation.LocationSubscription | null = null;

  stopObserving() {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  hasPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      const granted = status === "granted";
      return granted;
    } catch (error) {
      logger.error("Error checking permissions", error);
      return false;
    }
  };

  requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      const granted = status === "granted";
      logger.log("permission requested, granted?", granted);
      return granted;
    } catch (error) {
      logger.error("Error requesting permissions", error);
      return false;
    }
  };

  getCurrentPosition = async (
    options?: Partial<ExpoLocation.LocationOptions>
  ): Promise<ExpoLocation.LocationObject> => {
    const mergedOptions = { ...locationOptions, ...options };
    return await ExpoLocation.getCurrentPositionAsync(mergedOptions);
  };

  private getLastKnownLocation = async (): Promise<Location | null> => {
    try {
      const locationJson = await AsyncStorage.getItem("location");
      if (locationJson) {
        return JSON.parse(locationJson) as Location;
      }
    } catch (error) {
      logger.error("Error getting last known location", error);
    }
    return null;
  };

  saveLastKnownLocation = async (location: Location): Promise<void> => {
    try {
      await AsyncStorage.setItem("location", JSON.stringify(location));
    } catch (error) {
      logger.error("Error saving last known location", error);
    }
  };

  removeLastKnownLocation = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("location");
    } catch (error) {
      logger.error("Error removing last known location", error);
    }
  };

  loadLocation = async ({
    force = false,
    showLocationDialog = true,
  }: {
    force?: boolean;
    showLocationDialog?: boolean;
  } = {}): Promise<{ location: Location; connected: boolean } | undefined> => {
    try {
      // if (!force) {
      //   const lastKnownLocation = await this.getLastKnownLocation();
      //   if (lastKnownLocation) {
      //     logger.log("loading lastKnownLocation");
      //     return { location: lastKnownLocation, connected: false };
      //   }
      // }

      // Check and request permissions if needed
      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        const permissionGranted = await this.requestPermission();
        if (!permissionGranted) {
          throw new Error("Location permission denied");
        }
      }

      const options: Partial<ExpoLocation.LocationOptions> = {
        ...locationOptions,
        // Note: Expo Location doesn't have a direct equivalent to showLocationDialog
        // This would typically be handled by the permission request
      };

      const newLocation = await this.getCurrentLocation(undefined, options);

      return { location: newLocation, connected: true };
    } catch (error) {
      logger.warn("loadLocation error", error);
      throw error;
    }
  };

  getCurrentLocation = async (
    position?: ExpoLocation.LocationObject,
    options?: Partial<ExpoLocation.LocationOptions>
  ): Promise<Location> => {
    try {
      if (!position) {
        position = await this.getCurrentPosition(options);
      }

      const coordinate: Coordinate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const location = await this.getLocationFrom(coordinate);
      if (location) {
        await this.saveLastKnownLocation(location);
      }
      return location;
    } catch (error) {
      crashlyticsApi.recordError(error as Error);
      throw this.getError(error as Error);
    }
  };

  getLocationFrom = async (coordinate: Coordinate): Promise<Location> => {
    try {
      const placeJson = await Geocoder.from({
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      });

      const loc = await this.buildLocationFromPlace(
        placeJson.results[0] as unknown as GooglePlaceDetail
      );

      loc.coordinate = coordinate;
      return loc;
    } catch (error) {
      console.error(error);
      crashlyticsApi.recordError(error);
      Analytics.logEvent("location_error", { error: (error as Error).message });
      throw error;
    }
  };

  buildLocationFromPlace = async (
    detail: GooglePlaceDetail
  ): Promise<Location> => {
    const add = this.getFromComponents(detail.address_components);
    const country = countriesApi.getByCode(add.country.code.toUpperCase());
    const state = countriesApi.getStateByName(add.state!, country?.id!);
    let city: City | undefined;

    console.log("add", JSON.stringify(add));
    console.log("country", JSON.stringify(country));
    console.log("state", JSON.stringify(state));

    if (add.locality) {
      const cities = await citiesApi.getByName(add.locality, country!, state);

      if (cities && cities.length > 0) {
        city = cities[0];
      }
    } else if (state) {
      const dbCities = await citiesApi.getByStateId(state.id);
      if (dbCities && dbCities.length > 0) {
        city = dbCities[0];
      }
    }

    if (country && (state || city)) {
      const loc: Location = {
        coordinate: {
          latitude: detail.geometry.location.lat,
          longitude: detail.geometry.location.lng,
        },
        address: {
          name: detail.formatted_address,
          formattedAddress: detail.formatted_address,
        },
        placeId: detail.place_id,
        city,
        state,
        country: country!,
      };
      return loc;
    } else {
      const error = new Error(
        "Unmapped location, please contact Administrator"
      );
      (error as any).code = "app/unmappedLocation";
      Analytics.logEvent("location_error", {
        location: JSON.stringify({
          country: add.country.name,
          state: add.state,
          city: add.locality,
        }),
        error: (error as any).code ?? error.message,
      });
      throw error;
    }
  };

  private getFromComponents = (components: AddressComponent[]) => {
    return components.reduce(
      (acc, { types, short_name: sname, long_name: lname }) => {
        const type = types[0];

        switch (type) {
          case "route":
            return { ...acc, route: lname };
          case "administrative_area_level_1":
            return { ...acc, state: lname };
          case "locality":
            return { ...acc, locality: lname };
          case "country":
            return { ...acc, country: { name: lname, code: sname } };
          case "postal_code_prefix":
            return { ...acc, postalCodePrefix: lname };
          case "street_number":
            return { ...acc, streetNumber: lname };
          default:
            return acc;
        }
      },
      {}
    ) as {
      country: { name: string; code: string };
      locality?: string;
      state?: string;
      route?: string;
      streetNumber?: string;
    };
  };

  private getError = (error: Error) => {
    // Map Expo Location error codes to your custom error format
    const message = error.message;

    if (message.includes("permission") || message.includes("Permission")) {
      return { code: "location/permissionDenied", message };
    }

    if (message.includes("unavailable") || message.includes("disabled")) {
      return { code: "location/positionUnavailable", message };
    }

    if (message.includes("timeout") || message.includes("Timeout")) {
      return { code: "location/timeout", message };
    }

    return { code: "location/serviceNotAvailable", message };
  };

  watch = async (
    successCallback: (location: ExpoLocation.LocationObject) => void,
    errorCallback: (error: Error) => void
  ): Promise<ExpoLocation.LocationSubscription> => {
    try {
      // Clean up existing subscription
      if (this.watchSubscription) {
        this.watchSubscription.remove();
      }

      this.watchSubscription = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.High,
          timeInterval: 60000,
          distanceInterval: 100,
        },
        (location) => {
          try {
            successCallback(location);
          } catch (error) {
            errorCallback(error as Error);
          }
        }
      );

      return this.watchSubscription;
    } catch (error) {
      errorCallback(error as Error);
      throw error;
    }
  };

  clearWatch = (watchId?: ExpoLocation.LocationSubscription) => {
    if (watchId) {
      watchId.remove();
    }
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  };

  // Additional utility methods for Expo Location
  getLastKnownPositionAsync =
    async (): Promise<ExpoLocation.LocationObject | null> => {
      try {
        return await ExpoLocation.getLastKnownPositionAsync();
      } catch (error) {
        logger.error("Error getting last known position", error);
        return null;
      }
    };

  isLocationEnabledAsync = async (): Promise<boolean> => {
    try {
      return await ExpoLocation.hasServicesEnabledAsync();
    } catch (error) {
      logger.error("Error checking location services", error);
      return false;
    }
  };
}

const locationApi = new LocationApi();

export default locationApi;
