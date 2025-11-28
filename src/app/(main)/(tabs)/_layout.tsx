import { Icon } from "@/components/core";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/core/Icon";
import AddItemModal from "@/components/features/items/AddItemModal";
import { headerBackIconSize } from "@/components/HeaderBack";
import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useState } from "react";
import { I18nManager, StyleSheet, TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const { t } = useLocale("common");
  const [isAddItemModalVisible, setisAddItemModalVisible] = useState(false);
  const IconComponent = I18nManager.isRTL ? ChevronRightIcon : ChevronLeftIcon;

  const onAddPress = () => {
    setisAddItemModalVisible(true);
    // router.navigate("/(main)/(tabs)/add-item");
  };
  return (
    <>
      <Tabs
        initialRouteName="(home)"
        screenOptions={{
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
            color: theme.colors.salmon,
          },
          headerShadowVisible: false,
          tabBarActiveTintColor: theme.colors.secondary,
          tabBarLabelStyle: {
            color: theme.colors.dark,
          },
          sceneStyle: {
            backgroundColor: "white",
          },
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "white",
            paddingTop: 5,
            paddingHorizontal: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -3,
            },
            shadowOpacity: 0.25,
            shadowRadius: 5,
            elevation: 15,
          },
          tabBarItemStyle: {
            paddingHorizontal: 0,
            //   marginHorizontal: -5,
          },
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 15 }}
            >
              <IconComponent
                size={headerBackIconSize}
                color={theme.colors.grey}
              />
            </TouchableOpacity>
          ),
          lazy: false,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: t("tabBar.homeTitle"),
            headerShown: false,

            tabBarIcon: ({ color }) => (
              <FontAwesome size={20} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-items"
          options={{
            title: t("tabBar.myItemsTitle"),
            tabBarIcon: ({ color }) => (
              <Icon name="view-list-outline" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-item"
          options={{
            title: "",
            tabBarIcon: () => (
              <TouchableOpacity
                style={styles.addButton}
                onPress={onAddPress}
                activeOpacity={0.7}
              >
                <Icon name="plus" size={28} color="white" />
              </TouchableOpacity>
            ),
            tabBarLabel: () => null,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            },
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: t("tabBar.notificationsTitle"),
            tabBarIcon: ({ color }) => (
              <Icon name="bell-outline" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-deals"
          options={{
            title: t("tabBar.dealsTitle"),
            tabBarIcon: ({ color }) => (
              <Icon name="handshake" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
      <AddItemModal
        isVisible={isAddItemModalVisible}
        onClose={() => setisAddItemModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.salmon,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
