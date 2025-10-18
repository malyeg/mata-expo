import { useCallback, useEffect, useState } from "react";
import Rate, { AndroidMarket } from "react-native-rate";
import configApi from "../api/AppConfig";
import { LoggerFactory } from "../utils/logger";
import storageApi from "../utils/StorageApi";
import useAuth from "./useAuth";

type AppReview = {
  success?: boolean;
  lastCheckDate: number;
};
const logger = LoggerFactory.getLogger("useAppReview");
const APP_REVIEW = "APP_REVIEW";

const useAppReview = ({ requestReviewOnLoad = false, force = false } = {}) => {
  const [error, setError] = useState<Error | undefined>();
  const [appReview] = useState<AppReview | undefined>();
  const { user } = useAuth();
  const requestInAppReview = useCallback(async (duration?: any) => {
    const appReviewEnabled = configApi
      .getValue("app_review_enabled")
      .asBoolean();
    const whitelist = configApi.getValue("app_review_whitelist").asString();

    if (!appReviewEnabled) {
      logger.log(" appReview disabled, return");
      return;
    }

    if (whitelist && user?.id) {
      if (!whitelist.split(",").includes(user.id)) {
        logger.log("user not in whitelist, return", whitelist);
        return;
      }
      logger.log("user found in whiltelist");
    }
    const durationInMillis =
      duration ?? configApi.getValue("app_review_durationInMillis").asNumber();
    logger.log("start RequestInAppReview", durationInMillis);

    const storedAppReview = await storageApi.get<AppReview>(APP_REVIEW);

    if (storedAppReview) {
      logger.log("stored appReview found, checking status");

      if (storedAppReview.success && !force) {
        logger.log("status finished, no action required");
        return;
      }

      logger.log(
        "status not finished, checking last check date",
        storedAppReview.lastCheckDate
      );
      const delta = Date.now() - Number(storedAppReview.lastCheckDate);
      if (delta < durationInMillis) {
        logger.log(
          "app review lastCheckDate still in range, no action required",
          delta
        );
        return;
      }

      logger.log(
        "app review lastCheckDate expired, requesting app review",
        delta
      );
    }

    const lastCheckDate = Date.now();

    logger.log("Requesting InAppReview dialog");
    const newAppReview: AppReview = {
      lastCheckDate,
    };
    const baseOptionsSting = configApi.getValue("app_review_config").asString();
    const baseOptions = {
      ...JSON.parse(baseOptionsSting),
      preferredAndroidMarket: AndroidMarket.Google,
    };
    Rate.rate(baseOptions, async (success, errorMessage) => {
      logger.log({ success, errorMessage });
      if (success) {
        newAppReview.success = success;
        await storageApi.add(APP_REVIEW, newAppReview);
      }
      if (errorMessage) {
        setError(new Error(errorMessage));
      }
    });

    // await storageApi.add(APP_REVIEW, newAppReview);

    // if (!hasFlowFinishedSuccessfully) {
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (requestReviewOnLoad) {
      requestInAppReview();
    }
    logger.log("useAppReview useEffect");
  }, [requestInAppReview, requestReviewOnLoad]);

  return { requestInAppReview, appReview, error };
};
export default useAppReview;
