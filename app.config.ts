import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mata-app",
  slug: "mata-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "mataapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.mata.mataapp",
    googleServicesFile: "./firebase/GoogleService-Info.plist",
    infoPlist: {
      UIDesignRequiresCompatibility: true,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/bootsplash_logo.png",
    },
    googleServicesFile: "./firebase/google-services.json",
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: ["android.permission.WRITE_EXTERNAL_STORAGE"],
    package: "com.mata.mataapp",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-firebase/crashlytics",
    [
      "expo-location",
      {
        NSLocationWhenInUseUsageDescription:
          "Allowing the user to select and add location to his new items in order to be searchable by others.",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/logo.png",
        // imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          forceStaticLinking: ["RNFBApp"],
        },
      },
    ],
    [
      "react-native-share",
      {
        ios: ["fb", "instagram", "twitter", "tiktoksharesdk"],
        android: [
          "com.facebook.katana",
          "com.instagram.android",
          "com.twitter.android",
          "com.zhiliaoapp.musically",
        ],
        enableBase64ShareAndroid: true,
      },
    ],
    "expo-web-browser",
    "expo-localization",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
