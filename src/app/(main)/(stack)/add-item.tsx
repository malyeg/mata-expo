import { useAddItemStore } from "@/store/addItem-store";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";

const AddItem = () => {
  const router = useRouter();
  const { openAddItemModal } = useAddItemStore();

  // Use useFocusEffect to ensure this runs every time the route is accessed
  useFocusEffect(
    useCallback(() => {
      openAddItemModal();
      // Navigate to home - use replace to avoid stacking this route
      router.replace("/(main)/(stack)/(tabs)");
    }, [openAddItemModal, router])
  );

  // Return an empty view while redirecting
  return <View />;
};

export default AddItem;
