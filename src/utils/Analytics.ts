import { ICartItem } from "@/models/card-model";
import {
  FirebaseAnalyticsTypes,
  logLogin,
  setUserId,
  logSignUp,
  logEvent as firebaseLogEvent,
  resetAnalyticsData,
  logAddToCart,
  setAnalyticsCollectionEnabled,
  logShare,
  logScreenView,
  logAddToWishlist,
  logViewItemList,
  logSearch,
  logSelectItem as firebaseLogSelectItem,
  logSelectContent,
  logViewItem,
} from "@react-native-firebase/analytics";
import { app, analytics } from "../firebase";
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
    if (app.utils().isRunningInTestLab) {
      setAnalyticsCollectionEnabled(analytics, false);
    } else {
      setAnalyticsCollectionEnabled(analytics, true);
    }
  }

  static logLogin = (
    method: "FACEBOOK" | "APPLE" | "CREDENTIALS" | "GUEST"
  ) => {
    return logLogin(analytics, { method });
  };

  static setUser = (user: User) => {
    return Promise.all([
      setUserId(analytics, user.id),
      // setUserProperty(analytics, 'email', user.email),
    ]);
  };

  static logSignUp = (method: string, user: User) => {
    return Promise.all([
      Analytics.setUser(user),
      logSignUp(analytics, { method }),
    ]);
  };

  static logForgotPassword = (email: string) => {
    return firebaseLogEvent(analytics, "forgotPassword", {
      email,
    });
  };

  static logError = (eventName: string, error: Error, propertyObject = {}) => {
    return firebaseLogEvent(analytics, eventName + "_error", {
      ...propertyObject,
      error,
    });
  };

  static logEvent = (eventName: string, propertyObject = {}) => {
    return firebaseLogEvent(analytics, eventName, propertyObject ?? {});
  };

  static logSignOut = () => {
    return Promise.all([
      firebaseLogEvent(analytics, "logout"),
      resetAnalyticsData(analytics),
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
    await logAddToCart(analytics, {
      value,
      currency: constants.cart.DEFAULT_CURRENCY,
      items: cartItems as FirebaseAnalyticsTypes.Item[],
    });
  };

  static setAnalyticsCollectionEnabled = (enabled: boolean) => {
    return setAnalyticsCollectionEnabled(analytics, enabled);
  };

  static logScreen = (screenName: string) => {
    return firebaseLogEvent(analytics, "screen_" + screenName, {});
  };

  static logShare = (params: any) => {
    return logShare(analytics, params);
  };

  static trackScreen = async (screenName: string) => {
    try {
      await Promise.all([
        logScreenView(analytics, {
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
    logAddToWishlist(analytics, params);
  }
  static viewItemList(listId: string) {
    logViewItemList(analytics, {
      item_list_id: listId,
      item_list_name: listId,
    });
  }
  static logAddItemToWishlist(items: Item[]) {
    logAddToWishlist(analytics, {
      items: items.map((item) => ({
        item_id: item?.id,
        item_name: item?.name,
        item_category: item?.category?.name,
        item_location_id: item?.location?.placeId,
        item_category2: item.swapOption.type,
      })) as FirebaseAnalyticsTypes.Item[],
    });
  }

  static logSearch(searchTerm: string) {
    logSearch(analytics, {
      search_term: searchTerm,
    });
  }

  static logSelectItem(item: Item, listName?: string) {
    firebaseLogSelectItem(analytics, {
      content_type: "item_details",
      item_list_id: listName ?? item.category.name,
      item_list_name: listName ?? item.category.name,
      items: [Analytics.toAnalyticsItem(item)],
    });
  }
  static logSelectContent(id: string, type: string) {
    logSelectContent(analytics, {
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
    logViewItem(analytics, {
      items: [Analytics.toAnalyticsItem(item)],
    });
  }
}

export default Analytics;
