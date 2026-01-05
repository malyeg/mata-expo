import AddItemModal from "@/components/features/items/AddItemModal";
import useScreenOptions from "@/hooks/useScreenOptions";
import { useAddItemStore } from "@/store/addItem-store";
import { Stack } from "expo-router";
import React from "react";

const MainStackLayout = () => {
  const screenOptions = useScreenOptions();
  const { isAddItemModalVisible, closeAddItemModal } = useAddItemStore();

  return (
    <>
      <Stack
        screenOptions={{
          ...screenOptions,
          contentStyle: {
            ...(screenOptions.contentStyle as object),
            paddingBottom: 0,
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="items" options={{ headerShown: false }} />
        <Stack.Screen name="deals" options={{ headerShown: false }} />
        <Stack.Screen name="users" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
        <Stack.Screen name="add-item" options={{ headerShown: true }} />
        <Stack.Screen
          name="system"
          options={{ headerShown: true, title: "System" }}
        />
      </Stack>
      <AddItemModal
        isVisible={isAddItemModalVisible}
        onClose={closeAddItemModal}
      />
    </>
  );
};

export default MainStackLayout;
