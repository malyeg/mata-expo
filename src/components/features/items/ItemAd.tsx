// import {Link} from '@react-navigation/native';
import adsApi, { Ad } from "@/api/adsApi";
import configApi from "@/api/AppConfig";
import { Image } from "@/components/core";
// import NativeBannerView from "@/components/widgets/adMob/NativeBannerView";
import React, { useEffect, useState } from "react";
import {
  Linking,
  // Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
// import NativeBannerView from '@/components/widgets/adMob/NativeBannerView';

interface ItemAdProps {
  style: StyleProp<ViewStyle>;
}
const ItemAd = ({ style }: ItemAdProps) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const showAd = configApi.getValue("ads_enabled").asBoolean();

  useEffect(() => {
    const loadAds = async () => {
      const randomAd = await adsApi.getRandomOne();
      !!randomAd?.item && setAd(randomAd!.item);
    };
    loadAds();
  }, []);

  const adsEnabled = configApi.getValue("ads_enabled").asBoolean();

  if (!adsEnabled) {
    return null;
  }

  return showAd && !!ad ? (
    <View style={style}>
      {/* {ad?.type === "admob" ? <NativeBannerView /> : <CustomAd ad={ad} />} */}
    </View>
  ) : null;
};

interface CustomAdProps {
  ad: Ad;
}
const CustomAd = ({ ad }: CustomAdProps) => {
  const openAdLink = () => {
    !!ad?.url && Linking.openURL(ad?.url);
  };
  return (
    <View>
      <Image
        uri={ad.image?.url}
        style={styles.adImage}
        resizeMode="stretch"
        onPress={openAdLink}
      />
    </View>
  );
};

export default React.memo(ItemAd);

const styles = StyleSheet.create({
  adImage: {
    width: "100%",
    height: 100,
  },
});
