import theme from "@/styles/theme";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  TestIds,
} from "react-native-google-mobile-ads";

// Use test IDs in development, production IDs from env in production
// const NATIVE_AD_UNIT_ID = __DEV__
console.log(
  "NATIVE_AD_UNIT_ID",
  process.env.EXPO_PUBLIC_GOOGLE_ADMOB_IOS_UNIT_NATIVE_IMAGE_ID
);
const NATIVE_AD_UNIT_ID =
  Platform.select({
    ios: process.env.EXPO_PUBLIC_GOOGLE_ADMOB_IOS_UNIT_NATIVE_IMAGE_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ADMOB_ANDROID_UNIT_NATIVE_IMAGE_ID,
  }) ?? TestIds.NATIVE;

export const CustomAdBanner = () => {
  // 1. State to hold the loaded ad object
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [adError, setAdError] = useState<boolean>(false);

  useEffect(() => {
    // Log the ad unit ID being used for debugging
    console.log("Loading ad with unit ID:", NATIVE_AD_UNIT_ID);

    // 2. Load the ad manually using the static method
    // This returns a Promise that resolves when the ad is ready
    let adObject: NativeAd | null = null;

    NativeAd.createForAdRequest(NATIVE_AD_UNIT_ID)
      .then((loadedAd) => {
        console.log("Ad loaded successfully");
        adObject = loadedAd;
        setNativeAd(loadedAd);
      })
      .catch((error) => {
        console.error("Ad failed to load:", error);
        console.error("Ad unit ID was:", NATIVE_AD_UNIT_ID);
        setAdError(true); // Hide placeholder on error
      });

    // 3. Cleanup: You MUST destroy the ad when the component unmounts
    return () => {
      adObject?.destroy();
    };
  }, []);

  // 4. If ad failed to load, return nothing (hide the component)
  if (adError) {
    return null;
  }

  // 5. If ad isn't loaded yet, return nothing (will appear when ready)
  if (!nativeAd) {
    return null;
  }

  return (
    // 5. Pass the LOADED object to the view.
    // No 'adUnitID' or 'load' props go here!
    <NativeAdView nativeAd={nativeAd} style={styles.nativeAdView}>
      <View style={styles.container}>
        {/* Icon - wrapped in NativeAsset for proper registration */}
        {nativeAd.icon && (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image
              source={{ uri: nativeAd.icon.url }}
              style={styles.icon}
              resizeMode="cover"
            />
          </NativeAsset>
        )}

        {/* Text Content */}
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            {/* Ad Attribution - REQUIRED for AdMob policy compliance */}
            <Text style={styles.adBadge}>Ad</Text>
            {/* Headline - wrapped in NativeAsset for proper registration */}
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text style={styles.headline} numberOfLines={1}>
                {nativeAd.headline}
              </Text>
            </NativeAsset>
          </View>
          {/* Body/Tagline - wrapped in NativeAsset for proper registration */}
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text style={styles.tagline} numberOfLines={1}>
              {nativeAd.body || nativeAd.advertiser}
            </Text>
          </NativeAsset>
        </View>

        {/* Call to Action Button - wrapped in NativeAsset for proper registration */}
        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <Pressable style={styles.callToAction}>
            <Text style={styles.callToActionText}>
              {nativeAd.callToAction || "Open"}
            </Text>
          </Pressable>
        </NativeAsset>
      </View>
    </NativeAdView>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 72,
    backgroundColor: "#f0f0f0", // Skeleton color
    width: "100%",
  },
  nativeAdView: {
    width: "100%",
    height: 72, // Fixed height like a banner
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  adBadge: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#fab005",
    paddingHorizontal: 4,
    borderRadius: 3,
    marginRight: 6,
    overflow: "hidden",
  },
  headline: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  tagline: {
    fontSize: 12,
    color: "#666",
  },
  callToAction: {
    backgroundColor: theme.colors.salmon, // Theme Color
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  callToActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
