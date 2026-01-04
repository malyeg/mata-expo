import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

const BUILD_NUMBER = 206; // <--- Update this one number
const APP_VERSION = "2.0.6";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Mata",
  slug: "mata-app",
  version: APP_VERSION,
  orientation: "portrait",
  icon: "./assets/images/logo.png",
  scheme: "mataapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    buildNumber: String(BUILD_NUMBER),
    icon: "./assets/images/ios-icon.png", // Add this
    supportsTablet: false,
    bundleIdentifier: "com.mata.mataapp",
    appleTeamId: "VX43W4S7M9", // Mata Aotearoa Limited - for automatic code signing
    googleServicesFile: "./firebase/GoogleService-Info.plist",
    infoPlist: {
      CFBundleDisplayName: "Mata",
      UIDesignRequiresCompatibility: true,
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        "This app requires access to the camera for user to be able to upload item images.",
      NSPhotoLibraryUsageDescription:
        "This app requires access to the photo library for user to be able to upload item images.",
      NSUserTrackingUsageDescription:
        "This app uses device identifiers to track marketing attribution and app usage. Your data is kept confidential and is not shared with any 3rd parties or advertising partners.",
    },
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
    },
    associatedDomains: [
      "applinks:www.mataup.com",
      "applinks:mataup.com",
      "applinks:mataapp.page.link",
    ],
    entitlements: {
      "com.apple.developer.applesignin": ["Default"],
    },
  },
  android: {
    versionCode: BUILD_NUMBER,
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/bootsplash_logo.png",
    },
    googleServicesFile: "./firebase/google-services.json",
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: ["android.permission.WRITE_EXTERNAL_STORAGE"],
    package: "com.mata.mataapp",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
      },
    },
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          // Primary domain (www)
          { scheme: "https", host: "www.mataup.com", pathPrefix: "/items" },
          { scheme: "https", host: "www.mataup.com", pathPrefix: "/deals" },
          { scheme: "https", host: "www.mataup.com", pathPrefix: "/users" },
          { scheme: "https", host: "www.mataup.com", pathPrefix: "/home" },
          { scheme: "https", host: "www.mataup.com", pathPrefix: "/contact" },
          { scheme: "https", host: "www.mataup.com", pathPrefix: "/account" },
          { scheme: "https", host: "www.mataup.com", pathPrefix: "/add-item" },
          // Non-www domain (redirects to www, but included for safety)
          { scheme: "https", host: "mataup.com", pathPrefix: "/items" },
          { scheme: "https", host: "mataup.com", pathPrefix: "/deals" },
          { scheme: "https", host: "mataup.com", pathPrefix: "/users" },
          { scheme: "https", host: "mataup.com", pathPrefix: "/home" },
          { scheme: "https", host: "mataup.com", pathPrefix: "/contact" },
          { scheme: "https", host: "mataup.com", pathPrefix: "/account" },
          { scheme: "https", host: "mataup.com", pathPrefix: "/add-item" },
          // Legacy Firebase domain
          { scheme: "https", host: "mataapp.page.link", pathPrefix: "/items" },
          { scheme: "https", host: "mataapp.page.link", pathPrefix: "/deals" },
          { scheme: "https", host: "mataapp.page.link", pathPrefix: "/users" },
          { scheme: "https", host: "mataapp.page.link", pathPrefix: "/home" },
          {
            scheme: "https",
            host: "mataapp.page.link",
            pathPrefix: "/contact",
          },
          {
            scheme: "https",
            host: "mataapp.page.link",
            pathPrefix: "/account",
          },
          {
            scheme: "https",
            host: "mataapp.page.link",
            pathPrefix: "/add-item",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
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
      "react-native-fbsdk-next",
      {
        appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
        clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
        displayName: "Mata",
        scheme: `fb${process.env.EXPO_PUBLIC_FACEBOOK_APP_ID}`,
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true,
        iosUserTrackingPermission:
          "This app uses device identifiers to track marketing attribution and app usage.",
      },
    ],
    [
      "expo-location",
      {
        NSLocationWhenInUseUsageDescription:
          "Allowing the user to select and add location to his new items in order to be searchable by others.",
      },
    ],
    [
      "react-native-maps",
      {
        iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
        androidGoogleMapsApiKey:
          process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
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
          deploymentTarget: "15.1",
          useFrameworks: "static",
          forceStaticLinking: ["RNFBApp"],
        },
        android: {
          enableProguardInReleaseBuilds: true,
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
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "mata",
        organization: "medyour",
      },
    ],
    "expo-web-browser",
    "expo-localization",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "16806ac8-5da8-453f-b0ed-a038010d6020",
    },
  },
});
