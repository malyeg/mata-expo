// app/(app)/_layout.tsx
import DrawerContent from "@/navigation/DrawerContent";
import { Drawer } from "expo-router/drawer";
import React from "react";

const AppLayout = () => {
  return (
    <Drawer drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="index" options={{ headerShown: false }} />
    </Drawer>
  );
};

export default AppLayout;
