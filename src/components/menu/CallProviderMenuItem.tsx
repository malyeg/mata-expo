import { Linking, View } from "react-native";
import React from "react";
import AppMenuItem from "./AppMenuItem";
import i18n from "@/utils/i18n";
import { CallOutlineIcon } from "../Icons";
import theme from "@/components/theme";
import CallProviderModal from "@/components/providers/CallProviderModal";
import useModal from "@/hooks/useModal";
import type { Branch } from "@/models/branch.model";

type CallProviderMenuItemProps = {
  branch: Branch;
};

const CallProviderMenuItem = ({
  branch,
  ...props
}: CallProviderMenuItemProps) => {
  const { modalRef: callModalRef, present: presentCallModal } = useModal();

  const onPress = () => {
    const phones = branch.telephones;
    if (phones.length === 1) {
      void Linking.openURL(`tel:${phones[0]}`);
    } else {
      presentCallModal();
    }
  };
  return (
    <>
      <AppMenuItem
        {...props}
        title={i18n.t("common.appMenu.contactProviderLabel")}
        onPress={onPress}
        icon={() => (
          <View
            style={{
              backgroundColor: theme.colors.orange,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
              width: 30,
              height: 30
            }}
          >
            <CallOutlineIcon size={20} color={theme.colors.light} />
          </View>
        )}
      />
      <CallProviderModal modalRef={callModalRef} branch={branch} />
    </>
  );
};

export default CallProviderMenuItem;
