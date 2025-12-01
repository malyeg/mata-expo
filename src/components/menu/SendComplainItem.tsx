import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ComplainIcon } from "../core/Icon";
import AppMenuItem from "./AppMenuItem";

type MenuItemProps = {
  itemId: string;
};

const SendComplainItem = ({ itemId, ...props }: MenuItemProps) => {
  const { t } = useLocale("common");
  const router = useRouter();
  const sendComplain = () => {
    router.navigate({
      pathname: "/contact",
      params: { itemId, type: "complain" },
    });
  };
  return (
    <AppMenuItem
      {...props}
      title={t("appMenu.sendComplainLabel")}
      onPress={sendComplain}
      icon={() => (
        <View
          style={{
            backgroundColor: theme.colors.secondary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            width: 30,
            height: 30,
          }}
        >
          <ComplainIcon size={20} color={theme.colors.white} />
        </View>
      )}
    />
  );
};

export default SendComplainItem;
