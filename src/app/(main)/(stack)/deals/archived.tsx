import { RouteProp } from "@react-navigation/core";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import React from "react";

import IncomingDeals from "@/components/features/deals/IncomingDeals";
import OutgoingDeals from "@/components/features/deals/OutgoingDeals";
import { screens } from "@/config/constants";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";

const archivedDealsTabsOptions: MaterialTopTabNavigationOptions = {
  lazy: true,
  tabBarIndicatorStyle: { backgroundColor: theme.colors.salmon },
};

export type ArchivedStackParams = {
  [screens.OUTGOING_DEALS]: { archived: boolean };
  [screens.INCOMING_DEALS]: { archived: boolean };
};

export type ArchivedOutgoingDealsRoute = RouteProp<
  ArchivedStackParams,
  typeof screens.OUTGOING_DEALS
>;

export type ArchivedIncomingDealsRoute = RouteProp<
  ArchivedStackParams,
  typeof screens.INCOMING_DEALS
>;

const Tab = createMaterialTopTabNavigator<ArchivedStackParams>();

const ArchivedDealsTabs = () => {
  const { t } = useLocale("common");
  return (
    <Tab.Navigator screenOptions={archivedDealsTabsOptions}>
      <Tab.Screen
        name={screens.OUTGOING_DEALS}
        component={OutgoingDeals}
        initialParams={{ archived: true }}
        options={{
          tabBarLabel: t("screens.outgoingDeals"),
          tabBarLabelStyle: sharedStyles.tabbarLabel,
        }}
      />
      <Tab.Screen
        name={screens.INCOMING_DEALS}
        component={IncomingDeals}
        initialParams={{ archived: true }}
        options={{
          tabBarLabel: t("screens.incomingDeals"),
          tabBarLabelStyle: sharedStyles.tabbarLabel,
        }}
      />
    </Tab.Navigator>
  );
};

export default ArchivedDealsTabs;
