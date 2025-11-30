import { ItemDetailsContent } from "@/components/features/items/ItemDetailsContent";
import ItemDetailsMenu from "@/components/features/items/ItemDetailsMenu";
import { useNavigation } from "@react-navigation/native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";

const HomeItemDetailsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { id: itemId } = useLocalSearchParams<{ id: string }>();

  // Hide tab bar when this screen is focused
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      // Show tab bar again when leaving this screen
      parent?.setOptions({
        tabBarStyle: {
          display: "flex",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "white",
          paddingTop: 5,
          paddingHorizontal: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 15,
        },
      });
    };
  }, [navigation]);

  if (!itemId) {
    router.back();
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: ItemDetailsMenu,
        }}
      />
      <ItemDetailsContent itemId={itemId} />
    </>
  );
};

export default HomeItemDetailsScreen;
