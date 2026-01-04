import AppMenu from "@/components/menu/AppMenu";
import AppMenuItem from "@/components/menu/AppMenuItem";
import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

const DealsMenu = () => {
  const router = useRouter();
  const { t } = useLocale("common");

  const navigateToArchivedDeals = () => {
    router.push("/deals/archived");
  };

  return (
    <AppMenu>
      <AppMenuItem
        title={t("screens.archivedDeals")}
        onPress={navigateToArchivedDeals}
        icon={() => (
          <MaterialIcons name="archive" size={24} color={theme.colors.grey} />
        )}
      />
    </AppMenu>
  );
};

export default DealsMenu;
