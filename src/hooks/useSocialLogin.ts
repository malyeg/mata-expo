import { useMemo } from "react";
import { Platform } from "react-native";
import configApi from "@/api/AppConfig";

const getData = () => {
  const facebookLoginForIOSDisabled =
    configApi.getValue("facebookLogin_ios_enabled")?.asBoolean() === true;
  const facebookLoginForAndroidDisabled =
    configApi.getValue("facebookLogin_android_enabled")?.asBoolean() === true;

  const facebookLoginEnabled =
    Platform.OS === "ios"
      ? facebookLoginForIOSDisabled
      : facebookLoginForAndroidDisabled;
  const appleLoginEnabled =
    Platform.OS === "ios"
      ? configApi.getValue("appleLogin_ios_enabled")?.asBoolean() === true
      : false;

  const guestLoginAndroidEnabled =
    configApi.getValue("guestLogin_android_enabled")?.asBoolean() === true;
  const guestLoginIOSEnabled =
    configApi.getValue("guestLogin_ios_enabled")?.asBoolean() === true;

  const guestLoginEnabled =
    Platform.OS === "ios" ? guestLoginIOSEnabled : guestLoginAndroidEnabled;

  return {
    facebookLoginEnabled,
    appleLoginEnabled,
    guestLoginEnabled,
  };
};

const useSocialLogin = () => {
  const context = useMemo(() => getData(), []);

  return { ...context };
};

export default useSocialLogin;
