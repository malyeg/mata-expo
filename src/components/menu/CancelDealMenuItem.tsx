import dealsApi, { Deal } from "@/api/dealsApi";
import useApi from "@/hooks/useApi";
import useLocale from "@/hooks/useLocale";
import useSheet from "@/hooks/useSheet";
import useToast from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Icon from "../core/Icon";
import Sheet from "../widgets/Sheet";
import AppMenuItem from "./AppMenuItem";

type CancelDealMenuItemProps = {
  deal: Deal;
  closeMenu?: () => void;
};

const CancelDealMenuItem = ({
  deal,
  closeMenu,
  ...props
}: CancelDealMenuItemProps) => {
  const { t } = useLocale("dealDetailsScreen");
  const { request, loader } = useApi();
  const { show, sheetRef } = useSheet();
  const { showErrorToast } = useToast();
  const router = useRouter();

  const handleCancelDeal = async () => {
    show({
      header: t("cancelOfferConfirmationHeader"),
      body: t("cancelOfferConfirmationBody"),
      cancelCallback: () => {
        closeMenu?.();
      },
      confirmCallback: async () => {
        closeMenu?.();
        try {
          await request(() => dealsApi.cancelOffer(deal));
          router.navigate("/deals");
        } catch (error) {
          showErrorToast(error);
        }
      },
    });
  };

  return (
    <>
      <AppMenuItem
        {...props}
        title={t("menu.cancelLabel")}
        onPress={handleCancelDeal}
        icon={() => (
          <View
            style={{
              backgroundColor: theme.colors.error,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
              width: 30,
              height: 30,
            }}
          >
            <Icon
              name="close-circle-outline"
              size={20}
              color={theme.colors.white}
            />
          </View>
        )}
      />
      <Sheet ref={sheetRef} />
      {loader}
    </>
  );
};

export { CancelDealMenuItem };
