import { ICartItem } from "@/models/card-model";
import analytics, {
  firebase,
  FirebaseAnalyticsTypes,
} from "@react-native-firebase/analytics";
import { Item } from "../api/itemsApi";
import constants from "../config/constants";
import { User } from "../contexts/user-model";
import { LoggerFactory } from "./logger";

export interface AnalyticsEvent {
  name?: string;
  params?: {
    [key: string]: any;
  };
  disabled?: boolean;
}

export const ADMOB = {
  ACTIVE_VIEW: "ad_activeview",
  IMPRESSION: "ad_impression",
  CLICK: "ad_click",
  QUERY: "ad_query",
  REWARD: "ad_reward",
  EXPOSURE: "ad_exposure",
  LOADED: "ad_loaded",
};

export type ActionType = "add" | "update" | "delete" | "query";
class Analytics {
  static logger = LoggerFactory.getLogger("Analytics");
  static init() {
    if (firebase.app().utils().isRunningInTestLab) {
      analytics().setAnalyticsCollectionEnabled(false);
    } else {
      analytics().setAnalyticsCollectionEnabled(true);
    }
  }

  static logLogin = (
    method: "FACEBOOK" | "APPLE" | "CREDENTIALS" | "GUEST"
  ) => {
    return analytics().logLogin({ method });
  };

  static setUser = (user: User) => {
    return Promise.all([
      analytics().setUserId(user.id),
      // analytics().setUserProperty('email', user.email),
    ]);
  };

  static logSignUp = (method: string, user: User) => {
    return Promise.all([
      Analytics.setUser(user),
      analytics().logSignUp({ method }),
    ]);
  };

  static logForgotPassword = (email: string) => {
    return analytics().logEvent("forgotPassword", {
      email,
    });
  };

  static logError = (eventName: string, error: Error, propertyObject = {}) => {
    return analytics().logEvent(eventName + "_error", {
      ...propertyObject,
      error,
    });
  };

  static logEvent = (eventName: string, propertyObject = {}) => {
    return analytics().logEvent(eventName, propertyObject ?? {});
  };

  static logSignOut = () => {
    return Promise.all([
      analytics().logEvent("logout"),
      analytics().resetAnalyticsData(),
    ]);
  };

  static logAddToCart = async ({
    value,
    items,
  }: {
    value: number;
    items: ICartItem[];
  }) => {
    const cartItems = items.map((item) => {
      return {
        item_id: item.id,
        item_brand: item.brand,
        item_name: item.name,
        item_category: item.category,
      };
    });
    await analytics().logAddToCart({
      value,
      currency: constants.cart.DEFAULT_CURRENCY,
      items: cartItems,
    });
  };

  static setAnalyticsCollectionEnabled = (enabled: boolean) => {
    return analytics().setAnalyticsCollectionEnabled(enabled);
  };

  static logScreen = (screenName: string) => {
    return analytics().logEvent("screen_" + screenName, {});
  };

  static logShare = (params: any) => {
    return analytics().logShare(params);
  };

  static trackScreen = async (screenName: string) => {
    try {
      await Promise.all([
        analytics().logScreenView({
          screen_name: screenName,
          screen_class: screenName,
        }),
        Analytics.logScreen(screenName),
      ]);
    } catch (error) {
      Analytics.logger.error(error);
    }
  };

  static logAddToWishlist(params: any) {
    analytics().logAddToWishlist(params);
  }
  static viewItemList(listId: string) {
    analytics().logViewItemList({
      item_list_id: listId,
      item_list_name: listId,
    });
  }
  static logAddItemToWishlist(items: Item[]) {
    analytics().logAddToWishlist({
      items: items.map((item) => ({
        item_id: item?.id,
        item_name: item?.name,
        item_category: item?.category?.name,
        item_location_id: item?.location?.placeId,
        item_category2: item.swapOption.type,
      })),
    });
  }

  static logSearch(searchTerm: string) {
    analytics().logSearch({
      search_term: searchTerm,
    });
  }

  static logSelectItem(item: Item, listName?: string) {
    analytics().logSelectItem({
      content_type: "item_details",
      item_list_id: listName ?? item.category.name,
      item_list_name: listName ?? item.category.name,
      items: [Analytics.toAnalyticsItem(item)],
    });
  }
  static logSelectContent(id: string, type: string) {
    analytics().logSelectContent({
      item_id: id,
      content_type: type,
    });
  }

  static toAnalyticsItem(item: Item) {
    return {
      item_id: item?.id,
      item_name: item?.name,
      item_category: item?.category?.name,
      item_location_id: item?.location?.placeId,
      item_category2: item.swapOption.type,
    } as FirebaseAnalyticsTypes.Item;
  }

  static viewItem(item: Item) {
    analytics().logViewItem({
      items: [Analytics.toAnalyticsItem(item)],
    });
  }
}

export default Analytics;
