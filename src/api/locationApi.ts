import AsyncStorage from "@react-native-async-storage/async-storage";
import { PermissionsAndroid, Platform } from "react-native";
// import Geocoder from 'react-native-geocoding';
// import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
// import {
//   AddressComponent,
//   GooglePlaceDetail,
// } from 'react-native-google-places-autocomplete';
import Analytics from "../utils/Analytics";
import { LoggerFactory } from "../utils/logger";
import { City, Country, State } from "@/models/place.model";
// import crashlyticsApi from './CrashlyticsApi';

// type GeoOptions
// const opt: Geolocation.GeoOptions = {
//   accuracy: {
//     android: 'low',
//   },
//   timeout: 5000,
//   maximumAge: 60000,
//   enableHighAccuracy: false,
// };

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
  country: Country;
  placeId?: string;
  position?: { x: number; y: number };
  provider?: "SIM" | "GPS" | "INTERNET";
}

const logger = LoggerFactory.getLogger("LocationApi");

class LocationApi {
  removeLastKnownLocation(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  // stopObserving() {
  //   Geolocation.stopObserving();
  // }
  // hasPermission = async () => {
  //   let granted = false;
  //   if (Platform.OS === 'android') {
  //     const andGranted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     );
  //     granted = andGranted === PermissionsAndroid.RESULTS.GRANTED;
  //   } else {
  //     const iosGranted = await Geolocation.requestAuthorization('whenInUse');
  //     granted = iosGranted === 'granted';
  //   }
  //   logger.log('permission granted?', granted);
  //   return granted;
  // };
  // getCurrentPosition = (options?: Geolocation.GeoOptions) => {
  //   return new Promise<GeoPosition>(function (resolve, reject) {
  //     Geolocation.getCurrentPosition(resolve, reject, {...opt, ...options});
  //   });
  // };
  // private getLastKnownLocation = async () => {
  //   const locationJson = await AsyncStorage.getItem('location');
  //   if (locationJson) {
  //     return JSON.parse(locationJson) as Location;
  //   }
  // };
  // saveLastKnownLocation = (location: Location) => {
  //   return AsyncStorage.setItem('location', JSON.stringify(location));
  // };
  // removeLastKnownLocation = () => {
  //   return AsyncStorage.removeItem('location');
  // };
  // loadLocation = async ({force = false, showLocationDialog = true}) => {
  //   try {
  //     if (!force) {
  //       const lastKnownLocation = await locationApi.getLastKnownLocation();
  //       if (lastKnownLocation) {
  //         logger.log('loading lastKnownLocation');
  //         return {location: lastKnownLocation, connected: false};
  //       }
  //     }
  //     const options: Geolocation.GeoOptions = {...opt, showLocationDialog};
  //     logger.log('loading current location', options);
  //     const newlocation = await this.getCurrentLocation(undefined, options);
  //     return {location: newlocation, connected: true};
  //   } catch (error) {
  //     logger.warn('loadLocation error', error);
  //   }
  // };
  // getCurrentLocation = async (position?: GeoPosition, options = opt) => {
  //   try {
  //     if (!position) {
  //       position = await this.getCurrentPosition(options);
  //     }
  //     const location = await this.getLocationFrom(position.coords);
  //     if (location) {
  //       await locationApi.saveLastKnownLocation(location);
  //     }
  //     return location;
  //   } catch (error) {
  //     // logger.error('getCurrentLocation', error);
  //     crashlyticsApi.recordError(error as Error);
  //     throw this.getError(error as Error);
  //   }
  // };
  // getLocationFrom = async (coordinate: Coordinate) => {
  //   logger.log('getLocationFrom', coordinate);
  //   try {
  //     const placeJson = await Geocoder.from(coordinate);
  //     logger.log('placeJson');
  //     const loc = await this.buildLocationFromPlace(
  //       placeJson.results[0] as unknown as GooglePlaceDetail,
  //     );
  //     logger.log('loc found');
  //     loc.coordinate = coordinate;
  //     return loc;
  //   } catch (error) {
  //     console.error(error);
  //     crashlyticsApi.recordError(error);
  //     Analytics.logEvent('location_error', {error: (error as Error).message});
  //   }
  // };
  // buildLocationFromPlace = async (detail: GooglePlaceDetail) => {
  //   const add = this.getFromComponents(detail.address_components);
  //   const country = countriesApi.getByCode(add.country.code.toUpperCase());
  //   const state = countriesApi.getStateByName(add.state!, country?.id!);
  //   let city: City | undefined;
  //   if (add.locality) {
  //     const cities = await citiesApi.getByName(add.locality, country!, state);
  //     if (cities && cities.length > 0) {
  //       city = cities[0];
  //     }
  //   } else if (state) {
  //     const dbCities = (await citiesApi.getByStateId(state.id))?.items;
  //     if (dbCities && dbCities.length > 0) {
  //       city = dbCities[0];
  //     }
  //   }
  //   if (country && (state || city)) {
  //     const loc: Location = {
  //       coordinate: {
  //         latitude: detail.geometry.location.lat,
  //         longitude: detail.geometry.location.lng,
  //       },
  //       address: {
  //         name: detail.formatted_address,
  //         formattedAddress: detail.formatted_address,
  //       },
  //       placeId: detail.place_id,
  //       city,
  //       state,
  //       country: country!,
  //     };
  //     return loc;
  //   } else {
  //     const error = new Error(
  //       'Unmapped location, please contact Administrator',
  //     );
  //     (error as any).code = 'app/unmappedLocation';
  //     Analytics.logEvent('location_error', {
  //       location: JSON.stringify({
  //         country: add.country.name,
  //         state: add.state,
  //         city: add.locality,
  //       }),
  //       error: (error as any).code ?? error.message,
  //     });
  //     throw error;
  //   }
  // };
  // private getFromComponents = (components: AddressComponent[]) => {
  //   return components.reduce(
  //     (acc, {types, short_name: sname, long_name: lname}) => {
  //       const type = types[0];
  //       switch (type) {
  //         case 'route':
  //           return {...acc, route: lname};
  //         case 'administrative_area_level_1':
  //           return {...acc, state: lname};
  //         case 'locality':
  //           return {...acc, locality: lname};
  //         case 'country':
  //           return {...acc, country: {name: lname, code: sname}};
  //         case 'postal_code_prefix':
  //           return {...acc, postalCodePrefix: lname};
  //         case 'street_number':
  //           return {...acc, streetNumber: lname};
  //         default:
  //           return acc;
  //       }
  //     },
  //     {},
  //   ) as {
  //     country: {name: string; code: string};
  //     locality?: string;
  //     state?: string;
  //     route?: string;
  //     streetNumber?: string;
  //   };
  // };
  // private getError = (error: Error) => {
  //   // https://github.com/Agontuk/react-native-geolocation-service#error-codes
  //   const code: string = (error as unknown as {code: string}).code ?? 'other';
  //   switch (code) {
  //     case '1':
  //       return {code: 'location/permissionDenied', message: error.message};
  //     case '2':
  //       return {code: 'location/positionUnavailable', message: error.message};
  //     case '3':
  //       return {code: 'location/timeout', message: error.message};
  //     default:
  //       return {code: 'location/serviceNotAvailable', message: error.message};
  //   }
  // };
  // watch = (
  //   successCallback: Geolocation.SuccessCallback,
  //   errorCallback: Geolocation.ErrorCallback,
  // ) => {
  //   return Geolocation.watchPosition(successCallback, errorCallback, {
  //     // interval: 60000,
  //     useSignificantChanges: true,
  //   });
  // };
  // clearWatch = (watchId: number) => {
  //   Geolocation.clearWatch(watchId);
  // };
}

const locationApi = new LocationApi();

export default locationApi;
