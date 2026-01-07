import AddItemModal from "@/components/features/items/AddItemModal";
import useScreenOptions from "@/hooks/useScreenOptions";
import { useAddItemStore } from "@/store/addItem-store";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import React, { useEffect } from "react";

const MainStackLayout = () => {
  const screenOptions = useScreenOptions();
  const { isAddItemModalVisible, closeAddItemModal, openAddItemModal } =
    useAddItemStore();

  // Listen for deep links to add-item and open the modal
  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      if (event.url.includes("add-item")) {
        openAddItemModal();
      }
    };

    // Check if app was opened with add-item deep link
    Linking.getInitialURL().then((url) => {
      if (url?.includes("add-item")) {
        openAddItemModal();
      }
    });

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener("url", handleUrl);

    return () => {
      subscription.remove();
    };
  }, [openAddItemModal]);

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
