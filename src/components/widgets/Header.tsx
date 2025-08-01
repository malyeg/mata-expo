import theme from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { Icon, Text } from "../core";
import { IconProps } from "../core/Icon";
import PressableOpacity from "../core/PressableOpacity";

export interface MenuItem {
  label: string;
  onPress?: () => void;
  icon?: IconProps;
}
interface HeaderProps {
  title?: string;
  navigation: any;
  route: any;
  options?: any;
  menu?: {
    items: MenuItem[];
  };
  children?: React.ReactNode;
}
const Header = ({ title, options, route, menu, ...props }: HeaderProps) => {
  const router = useRouter();
  const onPressHandler = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <>
      <View style={styles.container}>
        <PressableOpacity onPress={onPressHandler} style={styles.navContainer}>
          <Icon name="chevron-left" color={theme.colors.grey} size={35} />
        </PressableOpacity>
        <Text style={styles.title} h5 numberOfLines={1}>
          {title ??
            (route?.params as { title: string })?.title ??
            options?.headerTitle ??
            route.name}
        </Text>
        <View style={styles.menuContainer}>
          {menu?.items && menu.items.length > 0 && (
            <Menu>
              <MenuTrigger>
                <Icon
                  name="more"
                  type="custom"
                  style={styles.moreIcon}
                  color={theme.colors.dark}
                />
              </MenuTrigger>
              <MenuOptions>
                {menu.items.map((item, index) => (
                  <MenuOption
                    key={index}
                    onSelect={item.onPress}
                    style={styles.menuItem}
                  >
                    {!!item.icon && (
                      <Icon
                        {...item.icon}
                        style={[styles.menuItemIcon, item.icon.style]}
                      />
                    )}
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </MenuOption>
                ))}
              </MenuOptions>
            </Menu>
          )}
          {props.children}
        </View>
      </View>
    </>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // height: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    // backgroundColor: "red",
    // top: 50,
  },
  navContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    // flex: 1,
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
  nav: {
    position: "absolute",
    left: 0,
  },
  rightContainer: {
    position: "absolute",
    right: 0,
  },
  menuContainer: {
    position: "absolute",
    // top: 0,
    right: 0,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    // width: 200,
    // height: 200,
    // backgroundColor: 'red',
    // alignSelf: 'flex-end',
  },
  moreIcon: {
    marginRight: 20,
  },
  menuItem: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingVertical: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 20,
  },
  menuItemIcon: {
    // position: 'absolute',
    // left: 5,
  },
});
