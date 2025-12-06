import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import React from "react";

import ActiveItems from "@/components/features/items/ActiveItems";
import ArchivedItems from "@/components/features/items/ArchivedItems";
import { screens } from "@/config/constants";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";

const tabsOptions: MaterialTopTabNavigationOptions = {
  lazy: true,
  tabBarIndicatorStyle: { backgroundColor: theme.colors.salmon },
  sceneStyle: { backgroundColor: theme.colors.white },
};

export type StackParams = {
  [screens.MY_ITEMS]: undefined;
  [screens.MY_ARCHIVED_ITEMS]: undefined;
};

const Tab = createMaterialTopTabNavigator<StackParams>();

const MyItemsTabs = () => {
  const { t } = useLocale(screens.MY_ITEMS);
  return (
    <Tab.Navigator
      screenOptions={tabsOptions}
      sceneContainerStyle={{ backgroundColor: theme.colors.white }}
    >
      <Tab.Screen
        name={screens.MY_ITEMS}
        component={ActiveItems}
        options={{
          tabBarLabel: t("menu.itemsLabel"),
          tabBarLabelStyle: sharedStyles.tabbarLabel,
        }}
      />
      <Tab.Screen
        name={screens.MY_ARCHIVED_ITEMS}
        component={ArchivedItems}
        options={{
          tabBarLabel: t("menu.archivedLabel"),
          tabBarLabelStyle: sharedStyles.tabbarLabel,
        }}
      />
    </Tab.Navigator>
  );
};

export default MyItemsTabs;
