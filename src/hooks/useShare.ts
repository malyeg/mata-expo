// useShare.ts
import constants from "@/config/constants";
import * as Sharing from "expo-sharing";
import { useCallback } from "react";
import { Platform, Share } from "react-native";

type ShareResult = {
  success: boolean;
  error?: Error;
};

interface UseShareHook {
  shareMessage: (message: string, title?: string) => Promise<ShareResult>;
  shareLink: (
    path: string,
    queryParams?: Record<string, string>,
    text?: string
  ) => Promise<ShareResult>;
  shareFile: (fileUri: string, mimeType?: string) => Promise<ShareResult>;
}

export function useShare(): UseShareHook {
  const shareMessage = useCallback(
    async (message: string, title?: string): Promise<ShareResult> => {
      try {
        console.log("Share message:", title, message);
        const result = await Share.share(
          { message, title },
          { dialogTitle: title }
        );
        console.log("Share response:", result);
        return { success: result.action === Share.sharedAction };
      } catch (error) {
        console.error("Share error:", error);
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        };
      }
    },
    []
  );

  const shareLink = useCallback(
    async (
      path: string,
      queryParams: Record<string, string> = {},
      text: string = ""
    ): Promise<ShareResult> => {
      try {
        console.log("Share link:", path, queryParams, text);
        // Generate a web URL for universal links
        const baseUrl = constants.BASE_URL;
        const queryString = new URLSearchParams(queryParams).toString();
        const url = queryString
          ? `${baseUrl}/${path}?${queryString}`
          : `${baseUrl}${path}`;

        // On iOS, pass text in message and URL separately to avoid duplicate links
        // On Android, include URL in message since Android doesn't support the url property
        const message =
          Platform.OS === "ios" ? text || "" : text ? `${text} ${url}` : url;
        const result = await Share.share(
          {
            message,
            url: Platform.OS === "ios" ? url : undefined,
          },
          { dialogTitle: "Share" }
        );
        return { success: result.action === Share.sharedAction };
      } catch (error) {
        console.error("Share link error:", error);
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        };
      }
    },
    []
  );

  const shareFile = useCallback(
    async (fileUri: string, mimeType?: string): Promise<ShareResult> => {
      if (Platform.OS === "web") {
        return {
          success: false,
          error: new Error(
            "File sharing is not supported on web via this method."
          ),
        };
      }

      try {
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(fileUri, { mimeType });
          return { success: true };
        } else {
          return {
            success: false,
            error: new Error("Sharing is not available on this device."),
          };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        };
      }
    },
    []
  );

  return {
    shareMessage,
    shareLink,
    shareFile,
  };
}
