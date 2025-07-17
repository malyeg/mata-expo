import * as ExpoLocation from "expo-location";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import crashlyticsApi from "../api/CrashlyticsApi";
import locationApi, { Location } from "../api/locationApi";
import Analytics from "../utils/Analytics";
import { LoggerFactory } from "../utils/logger";

const logger = LoggerFactory.getLogger("LocationStore");

interface LocationState {
  connected: boolean;
  location?: Location;
  hasPermission?: boolean;
  watching: boolean;
  lastRetry?: Date;
}

interface LocationActions {
  setLocation: (
    location: Location,
    connected: boolean,
    hasPermission?: boolean
  ) => void;
  setConnection: (
    watching: boolean,
    connected: boolean,
    lastRetry?: Date
  ) => void;
  setPermission: (hasPermission: boolean) => void;
  reloadLocation: () => Promise<void>;
  initializeLocation: () => Promise<void>;
  cleanup: () => void;
}

type LocationStore = LocationState & LocationActions;

// Global refs to maintain state across re-renders
let loadingRef = false;
let loadingCounterRef = 0;
let watchSubscription: ExpoLocation.LocationSubscription | null = null;
let retryIntervalId: NodeJS.Timeout | null = null;

const positionChanged = (
  position: ExpoLocation.LocationObject,
  location?: Location
) => {
  if (
    location?.coordinate &&
    location.coordinate.latitude === position.coords.latitude &&
    location.coordinate.longitude === position.coords.longitude
  ) {
    return false;
  }
  return true;
};

const useLocationStore = create<LocationStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    connected: false,
    hasPermission: false,
    watching: false,
    location: undefined,
    lastRetry: undefined,

    // Actions
    setLocation: (location, connected, hasPermission = true) => {
      set({
        location,
        connected,
        hasPermission,
        watching: true,
      });
    },

    setConnection: (watching, connected, lastRetry) => {
      set({
        watching,
        connected,
        lastRetry,
      });
    },

    setPermission: (hasPermission) => {
      set({ hasPermission });
    },

    reloadLocation: async () => {
      try {
        const resp = await locationApi.loadLocation({
          force: true,
          showLocationDialog: true,
        });
        console.log("retry location", resp);
        if (resp?.location) {
          get().setLocation(resp.location, resp.connected, true);
        }
      } catch (error) {
        logger.error("Error reloading location", error);
      }
    },

    initializeLocation: async () => {
      try {
        // Check permissions first
        const hasPermission = await locationApi.hasPermission();
        if (!hasPermission) {
          const permissionGranted = await locationApi.requestPermission();
          if (!permissionGranted) {
            get().setPermission(false);
            return;
          }
        }

        get().setPermission(true);

        // Load initial location
        try {
          const result = await locationApi.loadLocation({
            force: false,
          });
          if (result?.location) {
            get().setLocation(result.location, result.connected, true);
          }
        } catch (error) {
          logger.warn("getting location from telephony");
          // Handle fallback location logic here if needed
        }

        // Start watching location
        await watchLocation();
      } catch (error) {
        logger.error("Error initializing location", error);
        get().setPermission(false);
      }
    },

    cleanup: () => {
      if (watchSubscription) {
        logger.log("clearing watch subscription");
        locationApi.clearWatch(watchSubscription);
        watchSubscription = null;
      }
      if (retryIntervalId) {
        clearInterval(retryIntervalId);
        retryIntervalId = null;
      }
    },
  }))
);

const watchLocation = async () => {
  logger.log("watchLocation");

  try {
    watchSubscription = await locationApi.watch(
      async (position: ExpoLocation.LocationObject) => {
        const { location } = useLocationStore.getState();

        if (positionChanged(position, location) && !loadingRef) {
          logger.log("position change detected, loading new location");
          loadingRef = true;
          try {
            const newLocation = await locationApi.getCurrentLocation(position);
            if (newLocation) {
              useLocationStore.getState().setLocation(newLocation, true);
            }
          } catch (error) {
            logger.error("Error getting current location", error);
          } finally {
            loadingRef = false;
          }
        } else {
          logger.log("no change in position");
        }
      },
      (error: Error) => {
        logger.error("Error while watching location", error);
        crashlyticsApi.recordError(error);
        Analytics.logEvent("location_error");
        useLocationStore.getState().setConnection(false, false, new Date());
      }
    );
  } catch (error) {
    logger.error("Error setting up location watch", error);
    crashlyticsApi.recordError(error as Error);
    Analytics.logEvent("location_error");
    useLocationStore.getState().setConnection(false, false, new Date());
  }
};

// Subscribe to watching state changes to handle retry logic
useLocationStore.subscribe(
  (state) => state.watching,
  (watching) => {
    logger.log("watching state changed", watching);

    // Clear existing interval
    if (retryIntervalId) {
      clearInterval(retryIntervalId);
      retryIntervalId = null;
    }

    // Start retry interval if not watching and not loading
    if (watching === false && !loadingRef) {
      retryIntervalId = setInterval(() => {
        logger.log("setInterval retry");
        loadingCounterRef += 1;
        locationApi
          .loadLocation({ force: true, showLocationDialog: false })
          .then((result) => {
            logger.log("setInterval loadLocation success");
            loadingCounterRef = 0;
            if (result?.location) {
              useLocationStore
                .getState()
                .setLocation(result.location, result.connected, true);
            }
          })
          .catch((error) => {
            logger.error("setInterval loadLocation error", error);
          });
      }, 10000);
    }
  }
);

export default useLocationStore;
