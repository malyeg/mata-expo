import { remoteConfig } from "@/firebase";
import crashlytics from "@react-native-firebase/crashlytics";
import { FirebaseRemoteConfigTypes } from "@react-native-firebase/remote-config";
import DeviceInfo from "react-native-device-info";
import { LoggerFactory } from "../utils/logger";
// import {firebase} from '@react-native-firebase/analytics';
const defaultVersioning: VersioningInfo = {
  versionNumber: {
    soft: "0.6.5",
    hard: "0.6.5",
  },
  buildNumber: {
    soft: 97,
    hard: 97,
  },
  hasUpdate: false,
  forceUpdate: false,
};

const appReviewOptions = {
  AppleAppID: "1586122594",
  GooglePackageName: "com.mata.mataapp",
  preferInApp: true,
  openAppStoreIfInAppFails: false,
  fallbackPlatformURL: "http://www.mataup.com",
};

const defaultConfig: FirebaseRemoteConfigTypes.ConfigDefaults = {
  perf_enabled: true,
  perf_api_enabled: true,
  analytics_enabled: true,
  versioning: JSON.stringify(defaultVersioning),
  facebookLogin_ios_enabled: false,
  appleLogin_ios_enabled: false,
  facebookLogin_android_enabled: false,
  guestLogin_android_enabled: false,
  guestLogin_ios_enabled: false,
  ads_enabled: false,
  app_review_config: JSON.stringify(appReviewOptions),
  app_review_enabled: true,
  app_review_durationInMillis: 1000 * 60 * 60 * 24 * 15,
  // app_review_whitelist: undefined,
  item_archive_durationInMillis: 86400000,
  intro_enabled: true,
};

export interface VersioningInfo {
  versionNumber: {
    soft: string;
    hard: string;
  };
  buildNumber: {
    soft: number;
    hard: number;
  };
  hasUpdate: boolean;
  forceUpdate: boolean;
}

const logger = LoggerFactory.getLogger("ConfigApi");
class AppConfigApi {
  fetchConfig = async (minimumFetchIntervalMillis: number) => {
    try {
      await remoteConfig.setConfigSettings({
        minimumFetchIntervalMillis,
      });
      await remoteConfig.setDefaults(defaultConfig);
      const fetchedRemotely = await remoteConfig.fetchAndActivate();
      if (fetchedRemotely) {
        logger.trace("Configs were retrieved from the backend and activated.");
        logger.trace(remoteConfig.getAll());
      } else {
        logger.trace(
          "No configs were fetched from the backend, and the local configs were already activated."
        );
      }
    } catch (error) {
      console.warn(error);
    }
  };

  getValue = (key: keyof typeof defaultConfig) => {
    return remoteConfig.getValue(key as string);
  };

  getConfig = () => {
    return remoteConfig.getAll();
  };
  getVersionInfo = () => {
    try {
      const versioningInfo = this.getValue("versioning").asString();
      if (versioningInfo) {
        const versioningJson: VersioningInfo = JSON.parse(versioningInfo);
        const currentVersion = this.versionToNumber(DeviceInfo.getVersion());
        const currentBuild = Number(DeviceInfo.getBuildNumber());
        const hardVersion = this.versionToNumber(
          versioningJson.versionNumber.hard
        );
        const softVersion = this.versionToNumber(
          versioningJson.versionNumber.soft
        );
        if (
          hardVersion > currentVersion ||
          versioningJson.buildNumber.hard > currentBuild
        ) {
          versioningJson.forceUpdate = true;
        }

        if (
          softVersion > currentVersion ||
          versioningJson.buildNumber.soft > currentBuild
        ) {
          versioningJson.hasUpdate = true;
        }
        return versioningJson;
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
    }
  };

  private versionToNumber(version: string, length = 3) {
    let n = version.replace(/\./g, "");
    while (n.length < length) {
      n += "0";
    }
    return Number(n);
  }
}

const configApi = new AppConfigApi();

export default configApi;
