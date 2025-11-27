// app/(app)/_layout.tsx
import useActivity from "@/hooks/useActivity";
import useAppExit from "@/hooks/useAppExit";
import DrawerContent from "@/navigation/DrawerContent";
import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";

const drawerOptions: DrawerNavigationOptions = {
  headerShown: false,
  drawerStatusBarAnimation: "none",
  drawerHideStatusBarOnOpen: true,
  drawerType: "front",
  drawerStyle: {
    width: "80%",
    height: "100%",

    overflow: "hidden",
    borderTopEndRadius: 40,
    borderBottomEndRadius: 40,
  },
  sceneStyle: {
    backgroundColor: "white",
  },
};

const AppLayout = () => {
  useActivity();
  useAppExit();
  return (
    <Drawer
      backBehavior="history"
      screenOptions={drawerOptions}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
};

export default AppLayout;
