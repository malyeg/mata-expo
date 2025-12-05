// useShare.ts
import { useCallback } from "react";
import { Platform } from "react-native";
import type { ShareOptions } from "react-native-share";
import Share from "react-native-share";
import * as Sharing from "expo-sharing";
import constants from "@/config/constants";

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
        const shareOptions: ShareOptions = {
          title,
          message
        };
        const shareResponse = await Share.open(shareOptions);
        console.log("Share response:", shareResponse);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error))
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
        // Generate a web URL for universal links
        const baseUrl = constants.BASE_URL;
        const queryString = new URLSearchParams(queryParams).toString();
        const url = queryString
          ? `${baseUrl}${path}?${queryString}`
          : `${baseUrl}${path}`;

        const message = text ? `${text} ${url}` : url;
        await Share.open({ message });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error))
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
          )
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
            error: new Error("Sharing is not available on this device.")
          };
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error))
        };
      }
    },
    []
  );

  return {
    shareMessage,
    shareLink,
    shareFile
  };
}
