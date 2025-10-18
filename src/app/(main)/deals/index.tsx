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
import theme from "@/styles/theme";

const dealsTabsOptions: MaterialTopTabNavigationOptions = {
  lazy: true,
  tabBarIndicatorStyle: { backgroundColor: theme.colors.salmon },
};

export type StackParams = {
  [screens.OUTGOING_DEALS]: { archived: boolean } | undefined;
  [screens.INCOMING_DEALS]: { archived: boolean } | undefined;
};
export type OutgoingDealsRoute = RouteProp<
  StackParams,
  typeof screens.OUTGOING_DEALS
>;
export type IngoingDealsRoute = RouteProp<
  StackParams,
  typeof screens.INCOMING_DEALS
>;
const Tab = createMaterialTopTabNavigator<StackParams>();

const DealsTabs = () => {
  const { t } = useLocale("common");
  return (
    <Tab.Navigator screenOptions={dealsTabsOptions}>
      <Tab.Screen
        name={screens.OUTGOING_DEALS}
        component={OutgoingDeals}
        options={{
          tabBarLabel: t("screens.outgoingDeals"),
          tabBarLabelStyle: sharedStyles.tabbarLabel,
          // tabBarBadge: () => (
          //   <Badge count={newMessages?.outgoing} style={styles.badge} />
          // ),
        }}
      />
      <Tab.Screen
        name={screens.INCOMING_DEALS}
        component={IncomingDeals}
        options={{
          tabBarLabel: t("screens.incomingDeals"),
          tabBarLabelStyle: sharedStyles.tabbarLabel,
          // tabBarBadge: () => (
          //   <Badge
          //     type="notification"
          //     count={newMessages?.incoming}
          //     style={styles.badge}
          //   />
          // ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DealsTabs;
