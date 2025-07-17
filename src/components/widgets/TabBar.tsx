import dealsApi, { Deal } from "@/api/dealsApi";
import { screens } from "@/config/constants";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import useNotifications from "@/hooks/useNotifications";
import useRootNavigation from "@/hooks/useRootNavigation";
import theme from "@/styles/theme";
import { Filter, Operation, QueryBuilder } from "@/types/DataTypes";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import GuestModal from "../modals/GuestModal";
import AddIcon from "./Lottie/AddIcon";
import TabBarItem from "./TabBarItem";

export const ADD_ITEM_SCREEN = "AddItemScreen";
interface TabBarProps {
  // position: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
}
const tabBarScreens: string[] = [
  screens.HOME,
  screens.NOTIFICATIONS,
  screens.MY_ITEMS,
  screens.INCOMING_DEALS,
  screens.OUTGOING_DEALS,
];
const SCREEN_WIDTH = Dimensions.get("window").width;
const MARGIN = 0;
const TAB_BAR_WIDTH = SCREEN_WIDTH - 2 * MARGIN;
const TAB_WIDTH = TAB_BAR_WIDTH / 4;
const TAB_HEIGHT = 60;
const ADD_ITEM_WIDTH = 50;

type TabBarItem = {
  name: "home" | "myItems" | "notifications" | "deals";
  labelKey: string;
  iconOn: string;
  iconOff: string;
  screen: string;
};
const tabBarItems: TabBarItem[] = [
  {
    name: "home",
    labelKey: "tabBar.homeTitle",
    iconOn: "home",
    iconOff: "home-outline",
    screen: screens.HOME,
  },
  {
    name: "myItems",
    labelKey: "tabBar.myItemsTitle",
    iconOn: "view-list",
    iconOff: "view-list-outline",
    screen: screens.MY_ITEMS,
  },
  {
    name: "notifications",
    labelKey: "tabBar.notificationsTitle",
    iconOn: "bell",
    iconOff: "bell-outline",
    screen: screens.NOTIFICATIONS,
  },
  {
    name: "deals",
    labelKey: "tabBar.dealsTitle",
    iconOn: "handshake",
    iconOff: "handshake",
    screen: screens.DEALS_TABS,
  },
];

const TabBar = ({ style }: TabBarProps) => {
  const { t } = useLocale("common");
  const { user } = useAuth();
  const { notificationsCount } = useNotifications();
  const [dealsBadgeCount, setDealsBadgeCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [showGuestDialogVisible, setShowGuestDialogVisible] = useState(false);
  const { route, navigation } = useRootNavigation();
  const translateX = useSharedValue(0);
  const iconSize = useSharedValue(24);

  const updateIndex = (screenName: string) => {
    let updatedIndex = 0;
    switch (screenName) {
      case screens.MY_ITEMS:
        updatedIndex = 1;
        break;
      case screens.NOTIFICATIONS:
        updatedIndex = 2;
        break;
      case screens.DEALS_TABS:
        updatedIndex = 3;
        break;
      case screens.INCOMING_DEALS:
        updatedIndex = 3;
        break;
      case screens.OUTGOING_DEALS:
        updatedIndex = 3;
        break;
      default:
        updatedIndex = 0;
    }
    setIndex(updatedIndex);
  };
  useEffect(() => {
    translateX.value = index * TAB_WIDTH;
    iconSize.value = 40;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (route?.name && tabBarScreens.includes(route?.name)) {
      !!route && updateIndex(route?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.name]);

  useEffect(() => {
    const filters: Filter<Deal>[] = [
      {
        field: `newMessages.${user.id}`,
        operation: Operation.NOT_EQUAL,
        value: [],
      },
    ];

    const query = new QueryBuilder<Deal>().filters(filters).build();
    return dealsApi.onQuerySnapshot(
      (snapshot) => {
        let newMessagesCount = 0;
        snapshot.data.forEach((deal) => {
          const dealMessagesCount = deal.newMessages?.[user.id]?.length;
          if (dealMessagesCount) {
            newMessagesCount += dealMessagesCount;
          }
        });
        setDealsBadgeCount(newMessagesCount);
      },
      () => {},
      query
    );
  }, [user.id]);

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(translateX.value, {
            duration: 400,
          }),
        },
      ],
    };
  });

  const addItemPressHandler = useCallback(() => {
    if (user.isAnonymous) {
      setShowGuestDialogVisible(true);
      return;
    }
    navigation.navigate(screens.ADD_ITEM);
  }, [navigation, user.isAnonymous]);

  const onGuestDialogCancel = useCallback(() => {
    setShowGuestDialogVisible(false);
  }, []);

  const ItemComponent = useCallback(
    (item: TabBarItem) => {
      const dealsFocused =
        route?.name === screens.DEALS_TABS ||
        route?.name === screens.INCOMING_DEALS ||
        route?.name === screens.OUTGOING_DEALS;
      const isFocused =
        item.name === "deals" ? dealsFocused : route?.name === item.screen;
      const badge =
        item.name === "deals"
          ? dealsBadgeCount
          : item.name === "notifications"
          ? notificationsCount
          : undefined;
      const onTabBarPress = () => {
        if (user.isAnonymous) {
          setShowGuestDialogVisible(true);
          return;
        }
        updateIndex(item.screen);
        navigation.navigate(item.screen);
      };
      return (
        <TabBarItem
          key={item.name}
          label={t(item.labelKey)}
          icon={route?.name === item.screen ? item.iconOn : item.iconOff}
          to={{ screen: item.screen }}
          isFocused={isFocused}
          badge={badge}
          onPress={onTabBarPress}
          style={[styles.item]}
          iconStyle={item.name === "deals" ? styles.dealsIcon : undefined}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dealsBadgeCount, notificationsCount, route?.name]
  );

  return !route || tabBarScreens.includes(route.name) ? (
    <View
      style={[
        styles.container,
        Platform.OS === "ios" ? styles.ios : undefined,
        style,
      ]}
    >
      <View style={styles.itemsContainer}>
        <View style={styles.addItemContainer}>
          <AddIcon onPress={addItemPressHandler} style={styles.addItem} />
        </View>

        <Animated.View style={[styles.slidingContainer, stylez]}>
          <LinearGradient
            colors={["#ececec", "#ffffff"]}
            style={[
              styles.slidingView,
              index === 0 ? styles.slidingViewEdgeLeft : undefined,
              index === 3 ? styles.slidingViewEdgeRight : undefined,
            ]}
          />
        </Animated.View>

        {tabBarItems.map(ItemComponent)}
      </View>
      <GuestModal
        isVisible={showGuestDialogVisible}
        onCancel={onGuestDialogCancel}
      />
    </View>
  ) : null;
};

export default React.memo(TabBar);

const styles = StyleSheet.create({
  container: {
    height: TAB_HEIGHT,
    width: "100%",
    bottom: 0,
    backgroundColor: theme.colors.white,
  },
  itemsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    ...Platform.select({
      ios: {
        borderColor: theme.colors.lightGrey,
        borderWidth: 2,
        borderBottomWidth: 0,
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOpacity: 1,
        elevation: 3,
        // paddingBottom: 10,
      },
    }),
  },
  addItemContainer: {
    position: "absolute",
    right: SCREEN_WIDTH / 2 - ADD_ITEM_WIDTH / 2,
    bottom: TAB_HEIGHT / 2,
    elevation: 5,
    zIndex: 1000,
  },
  addItem: {
    backgroundColor: theme.colors.salmon,
    height: ADD_ITEM_WIDTH,
    width: ADD_ITEM_WIDTH,
    borderRadius: ADD_ITEM_WIDTH / 2,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  addItemIcon: {
    color: theme.colors.white,
  },
  dealsIcon: {
    transform: [{ rotate: "40deg" }],
  },
  item: {
    width: TAB_WIDTH,
  },
  slidingContainer: {
    ...StyleSheet.absoluteFillObject,
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    padding: 0,
    margin: 0,
  },
  slidingView: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    backgroundColor: "grey",

    ...Platform.select({
      android: {
        top: 7, // TODO [workaround] to elevation extra padding
      },
    }),
  },
  slidingViewEdgeLeft: {
    borderTopLeftRadius: 30,
  },
  slidingViewEdgeRight: {
    borderTopRightRadius: 30,
  },
  ios: {
    marginBottom: -10,
  },
});
