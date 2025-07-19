import { swapList } from "@/api/itemsApi";
import { Image, Screen } from "@/components/core";
import SignUpCard from "@/components/features/auth/SignUpCard";
import ItemsFilter, {
  ItemsFilterForm,
  ItemsFilterProps,
} from "@/components/widgets/data/ItemsFilter";
import ItemsSearch from "@/components/widgets/ItemsSearch";
import NearByItems from "@/components/widgets/NearByItems";
import OfflineCard from "@/components/widgets/OfflineCard";
import RecommendedItems from "@/components/widgets/RecommendedItems";
import TopCategories from "@/components/widgets/TopCategories";
import UpdateProfileCard from "@/components/widgets/UpdateProfileCard";
import useAuth from "@/hooks/useAuth";
import useLocationStore from "@/store/location-store";
import theme from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HOME_SCREEN = "HomeScreen";
const bannerImage = require("@/assets/images/freeItemsAd.jpg");

const HomeScreen = () => {
  const { user, profile } = useAuth();
  const { location } = useLocationStore();
  const { top } = useSafeAreaInsets();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isItemsFilterVisible, setItemsFilterVisible] = useState(false);
  const [itemsFilterFocusField, setItemsFilterFocusField] =
    useState<ItemsFilterProps["focusOn"]>(undefined);
  const router = useRouter();

  const onRefresh = useCallback(() => {
    setLastRefresh(new Date());
  }, []);

  const openFilter = useCallback(() => {
    setItemsFilterFocusField("search");
    setItemsFilterVisible(true);
  }, []);

  const onFilterChange = useCallback(
    (filters: ItemsFilterForm) => {
      setItemsFilterVisible(false);
      router.push("/(main)/items", {
        filters,
      });
    },
    [router]
  );

  const openFreeItems = useCallback(() => {
    const filters: ItemsFilterForm = {
      swapTypes: swapList.filter((s) => s.id === "free"),
    };
    setItemsFilterVisible(false);
    router.push("/(main)/items", {
      filters,
    });
  }, [router]);

  const closeFilter = useCallback(() => {
    setItemsFilterVisible(false);
  }, []);

  return (
    <Screen
      style={[styles.container, { paddingTop: top }]}
      refreshable
      onRefresh={onRefresh}
      keyboardShouldPersistTaps="always"
      scrollable={true}
    >
      <OfflineCard />
      <ItemsSearch onPress={openFilter} />
      {user?.isAnonymous && <SignUpCard />}
      {!user?.isAnonymous && !profile?.updated && <UpdateProfileCard />}

      {!!location && (
        <>
          {profile?.targetCategories && (
            <RecommendedItems
              style={[styles.recommendedItems, styles.topMargin]}
              location={{
                coordinate: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
              }}
            />
          )}
          <NearByItems
            key={lastRefresh.getTime()}
            style={styles.nearByItems}
            // onNoItemsLinkPress={openFilterWithStates}
          />
        </>
      )}
      <TopCategories style={styles.categories} />
      <Image
        source={bannerImage}
        style={styles.banner}
        onPress={openFreeItems}
      />
      <ItemsFilter
        onChange={onFilterChange}
        openOnLoad={isItemsFilterVisible}
        onClose={closeFilter}
        focusOn={itemsFilterFocusField}
        defaultValues={{ country: location?.country }}
      />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // paddingBottom: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 60,
  },
  menuIcon: {
    position: "absolute",
    left: 0,
  },
  nearByItems: {
    marginBottom: 10,
    marginVertical: 10,
    marginRight: theme.defaults.SCREEN_PADDING * -1,
  },
  recommendedItems: {
    // marginBottom: 10,
    marginRight: theme.defaults.SCREEN_PADDING * -1,
  },
  categories: {
    marginVertical: 10,
    marginRight: theme.defaults.SCREEN_PADDING * -1,
  },
  tabBar: {
    position: "absolute",
  },
  itemsSearch: {
    marginBottom: 15,
  },
  banner: {
    marginTop: 10,
    width: "100%",
    height: 100,
  },
  topMargin: {
    marginTop: 10,
  },
});
