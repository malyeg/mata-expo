import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { LoggerFactory } from "../utils/logger";
import useLocale from "./useLocale";

const logger = LoggerFactory.getLogger("useAppExit");

// Home screen paths where exit dialog should appear
const HOME_PATHS = [
  "/",
  "/(main)",
  "/(main)/(stack)/(tabs)",
  "/(main)/(stack)/(tabs)/index",
];

const useAppExit = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale("app");

  useEffect(() => {
    const backAction = () => {
      logger.log("back handler init, pathname:", pathname);

      // Only show exit dialog if we're on the home screen
      const isOnHomeScreen = HOME_PATHS.includes(pathname) || pathname === "/";
      const canGoBack = router.canGoBack();

      if (isOnHomeScreen && !canGoBack) {
        logger.log("back handler: on home screen, showing exit dialog");
        Alert.alert(t("exitModal.title"), t("exitModal.body"), [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }

      // On other screens, let the default back behavior work
      logger.log("back handler: not on home screen or can go back");
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [pathname, router, t]);

  return {};
};

export default useAppExit;
