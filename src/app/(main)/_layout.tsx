// app/(app)/_layout.tsx
import profilesApi from "@/api/profileApi";
import Intro from "@/components/widgets/Intro";
import useActivity from "@/hooks/useActivity";
import useAppExit from "@/hooks/useAppExit";
import usePushTokenSync from "@/hooks/usePushTokenSync";
import DrawerContent from "@/navigation/DrawerContent";
import { DrawerNavigationOptions } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";

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
  usePushTokenSync();

  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLoad = async () => {
      const isFirst = await profilesApi.isFirstLoad();
      setShowIntro(isFirst);
    };
    checkFirstLoad();
  }, []);

  // Wait until we know if it's first load
  if (showIntro === null) {
    return null;
  }

  // Show intro on first load
  if (showIntro) {
    return <Intro onSkip={() => setShowIntro(false)} />;
  }

  return (
    <Drawer
      backBehavior="history"
      screenOptions={drawerOptions}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="(stack)" />
    </Drawer>
  );
};

export default AppLayout;
