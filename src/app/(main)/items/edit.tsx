import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const EditItemScreen = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  console.log("EditItemScreen id", id);
  return (
    <View>
      <Text>EditItemScreen</Text>
    </View>
  );
};

export default EditItemScreen;
