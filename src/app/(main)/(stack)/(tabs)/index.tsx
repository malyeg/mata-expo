import { Image, Screen } from "@/components/core";
import SignUpCard from "@/components/features/auth/SignUpCard";
import ItemsFilter, {
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
import { theme } from "@/styles/theme";
import { Query } from "@/types/DataTypes";
import { ItemsParams } from "@/utils/ItemsSearchUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HOME_SCREEN = "HomeScreen";
const bannerImage = require("@/assets/images/freeItemsAd.jpg");

const HomeScreen = () => {
  const { user, profile } = useAuth();
  const { location } = useLocationStore();
  const { top } = useSafeAreaInsets();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const nav = useNavigation<DrawerNavigationProp<any>>();
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
    (query: Query) => {
      setItemsFilterVisible(false);
      const params: ItemsParams = {};
      const categoryFilter = query.filters?.find(
        (f) => f.field === "catLevel1,catLevel2,catLevel3"
      );
      if (categoryFilter?.id) {
        params.categoryId = categoryFilter.id;
      }

      const countryFilter = query.filters?.find((f) => f.field === "countryId");
      if (countryFilter?.value) {
        params.countryId = countryFilter.value;
      }

      const stateFilter = query.filters?.find((f) => f.field === "stateId");
      if (
        stateFilter?.value &&
        Array.isArray(stateFilter.value) &&
        stateFilter.value.length > 0
      ) {
        params.stateId = JSON.stringify({ id: stateFilter.value[0] });
      }

      const swapTypeFilter = query.filters?.find(
        (f) => f.field === "swapOptionType"
      );
      if (
        swapTypeFilter?.value &&
        Array.isArray(swapTypeFilter.value) &&
        swapTypeFilter.value.length > 0
      ) {
        params.swapOptionType = swapTypeFilter.value[0];
      }

      const conditionFilter = query.filters?.find(
        (f) => f.field === "conditionType"
      );
      if (
        conditionFilter?.value &&
        Array.isArray(conditionFilter.value) &&
        conditionFilter.value.length > 0
      ) {
        params.conditionType = conditionFilter.value[0];
      }

      router.navigate({
        pathname: "/(main)/(stack)/items",
        params,
      });
    },
    [router]
  );

  const openFreeItems = useCallback(() => {
    const params: ItemsParams = {
      swapOptionType: "free",
    };
    setItemsFilterVisible(false);
    router.navigate({
      pathname: "/(main)/(stack)/items",
      params,
    });
  }, [router]);

  const closeFilter = useCallback(() => {
    setItemsFilterVisible(false);
  }, []);

  const toggleMenu = useCallback(() => {
    nav.toggleDrawer();
  }, [nav]);

  return (
    <Screen
      style={[styles.container, { paddingTop: top }]}
      refreshable
      onRefresh={onRefresh}
      keyboardShouldPersistTaps="always"
      scrollable={true}
    >
      <View>
        <MaterialCommunityIcons
          name="menu"
          color={theme.colors.dark}
          size={30}
          onPress={toggleMenu}
        />
      </View>
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
                  latitude: location.coordinate.latitude,
                  longitude: location.coordinate.longitude,
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
        defaultValues={
          location?.country ? { country: location?.country } : undefined
        }
      />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    gap: 10,
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
    // marginBottom: 10,
    // marginVertical: 10,
    marginRight: theme.defaults.SCREEN_PADDING * -1,
  },
  recommendedItems: {
    // marginBottom: 10,
    marginRight: theme.defaults.SCREEN_PADDING * -1,
  },
  categories: {
    // marginVertical: 10,
    marginRight: theme.defaults.SCREEN_PADDING * -1,
  },
  tabBar: {
    position: "absolute",
  },
  itemsSearch: {
    // marginBottom: 15,
  },
  banner: {
    // marginTop: 10,
    width: "100%",
    height: 100,
  },
  topMargin: {
    // marginTop: 10,
  },
});
