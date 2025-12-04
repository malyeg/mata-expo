import useLocale from "@/hooks/useLocale";
import { useShare } from "@/hooks/useShare";
import { theme } from "@/styles/theme";
import React from "react";
import { View } from "react-native";
import { ShareIcon } from "../core/Icon";
import AppMenuItem from "./AppMenuItem";

type ShareMenuItemProps = {
  link: string;
};

const ShareMenuItem = ({ link, ...props }: ShareMenuItemProps) => {
  const { shareLink } = useShare();
  const { t } = useLocale("common");
  const share = () => {
    void shareLink(link);
  };
  return (
    <AppMenuItem
      {...props}
      title={t("appMenu.shareLabel")}
      onPress={share}
      icon={() => (
        <View
          style={{
            backgroundColor: theme.colors.blue,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            width: 30,
            height: 30,
          }}
        >
          <ShareIcon size={20} color={theme.colors.white} />
        </View>
      )}
    />
  );
};

export default ShareMenuItem;
