import { Platform } from "react-native";

const BASE_URL = "https://mataapp.page.link";
const SHARE_DOMAIN = `${BASE_URL}/home`;
const PACKAGE_NAME = "com.mata.mataapp";

const IOS_STORE_URL = "https://testflight.apple.com/join/yZfALhoK";
// const IOS_STORE_URL = `https://apps.apple.com/us/app/doorhub-driver/${PACKAGE_NAME}`;
const GOOGLE_STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

const STORE_URL = Platform.OS === "ios" ? IOS_STORE_URL : GOOGLE_STORE_URL;

export const auth = {
  password: {
    STRONG_PATTERN: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\w\d\s:])([^\s]){8,}$/,
    MEDIUM_PATTERN: /^(?=.*\d)(?=.*[a-zA-Z])([^\s]){8,}$/,
  },
  PASSWORD_PATTERN: /^(?=.*\d)(?=.*[a-zA-Z])([^\s]){8,}$/,
};

export const firebase = {
  REGION: "australia-southeast1",
  ITEM_UPLOAD_PATH: "images/items",
  MAX_IMAGE_SIZE: 5 * 1000 * 1000,
  MAX_QUERY_LIMIT: 100,
  TEMP_IMAGE_URL:
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.smartdatajob.com%2Findex.php%2Fen%2F&psig=AOvVaw1MzxSql0s6MvMQQsPKug7q&ust=1628587135925000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKCbv_PQo_ICFQAAAAAdAAAAABAD",
};

export const patterns = {
  DATE: "d MMMM, yyyy",
  DATE_TIME: "d MMMM, yyyy HH:mm",
  FULL_TIME: "HH:mm:ss:SS",
};

export const payment = {
  SUPPORT_US_URL: "https://www.mataup.com/support-mata/",
};

export const legalInfo = {
  PRIVACY_URL: "https://www.mataup.com/privacy-policy/",
  TERMS_URL: "https://www.mataup.com/terms-of-service/",
};

export const DOMAINS = [
  "mataapp://",
  "http://*.mataup.com",
  "http://mataup.com",
  "https://*.mataup.com",
  "https://mataup.com",
];

export const maps = {
  DEFAULT_LOCATION: {
    latitude: -41.28664,
    longitude: 174.7787,
    latitudeDelta: 1,
    longitudeDelta: 1,
  },
};

export const locale = {
  DEFAULT_LANGUAGE: "en",
  FALLBACK_LANGUAGE: "en",
  STORAGE_NAME: "language",
};

export const API_URI = {
  TOKEN: "accounts/oauth/token",
  SIGNOUT: "accounts/oauth/signout",
  PROFILE: "accounts/profile",
  BRANCHES: "/branches",
  SERVICES: "/services",
};

export const REGEX = {
  MOBILE: /^(\+91-|\+91|0)?\d{10}$/,
  EMAIL: /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,
};

export const cart = {
  DEFAULT_CURRENCY: "EGP",
};

export const stacks = {
  HOME_STACK: "HomeStack" as "HomeStack",
};
export const screens = {
  SIGN_IN: "SignInScreen" as "SignInScreen",
  SIGN_UP: "SignUpScreen" as "SignUpScreen",
  FORGOT_PASSWORD: "ForgotPasswordScreen" as "ForgotPasswordScreen",
  HOME: "HomeScreen" as "HomeScreen",

  ITEMS: "ItemsScreen" as "ItemsScreen",
  ITEM_DETAILS: "ItemDetailsScreen" as "ItemDetailsScreen",
  MY_ITEMS: "MyItemsScreen" as "MyItemsScreen",
  MY_ARCHIVED_ITEMS: "MyArchivedItemsScreen" as "MyArchivedItemsScreen",
  USER_ITEMS: "UserItemsScreen" as "UserItemsScreen",
  ADD_ITEM: "AddItemScreen" as "AddItemScreen",
  EDIT_ITEM: "AddItemScreen" as "AddItemScreen",
  ITEMS_MAP: "ItemsMapScreen" as "ItemsMapScreen",

  DEALS: "DealsScreen" as "DealsScreen",
  MY_DEALS: "MyDealsScreen" as "MyDealsScreen",
  DEALS_TABS: "deals" as "deals",
  ARCHIVED_DEALS_TABS: "ArchivedDealsTabs" as "ArchivedDealsTabs",
  OUTGOING_DEALS: "OutgoingDealsScreen" as "OutgoingDealsScreen",
  INCOMING_DEALS: "IncomingDealsScreen" as "IncomingDealsScreen",
  DEAL_DETAILS: "DealDetailsScreen" as "DealDetailsScreen",

  NOTIFICATIONS: "NotificationsScreen" as "NotificationsScreen",

  PROFILE: "ProfileScreen" as "ProfileScreen",
  EDIT_PROFILE: "EditProfileScreen" as "EditProfileScreen",
  CHANGE_PASSWORD: "ChangePasswordScreen" as "ChangePasswordScreen",
  INTERESTS: "MyInterestsScreen" as "MyInterestsScreen",
  // INVITE_FRIEND: 'InviteFriendScreen' as 'InviteFriendScreen',
  WISH_LIST: "WishListScreen" as "WishListScreen",

  SETTINGS: "SettingsScreen" as "SettingsScreen",
  FAQ: "FAQScreen" as "FAQScreen",
  SUPPORT_US: "SupportUsScreen" as "SupportUsScreen",

  CONTACT_US: "contact" as "contact",
  COMPLAINS: "ComplainsScreen" as "ComplainsScreen",
  LEGAL_INFORMATION: "legal-info" as "legal-info",
  PRIVACY: "PrivacyScreen" as "PrivacyScreen",
  TERMS: "TermsScreen" as "TermsScreen",

  SYSTEM: "SystemScreen" as "SystemScreen",
  NO_CONNECTION: "NoConnectionScreen" as "NoConnectionScreen",
  NO_LOCACTION: "NoLocationScreen" as "NoLocationScreen",

  TEST: "TestScreen" as "TestScreen",
};

const deals = {
  CLOSE_CHAT_AFTER_DAYS: 3,
};
const page = {
  SIZE: 20,
};

const constants = {
  STORE_URL,
  firebase,
  maps,
  // AuthBgImage,
  BASE_URL,
  locale,
  API_URI,
  REGEX,
  cart,
  auth,
  DOMAINS,
  screens,
  payment,
  stacks,
  patterns,
  SHARE_DOMAIN,
  deals,
  page,
  legalInfo,
};

export default constants;
