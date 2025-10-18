import theme from "@/styles/theme";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation, useRouter, useSegments } from "expo-router";
import React, { useCallback } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { I18nManager, Platform, Pressable, View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon, MenuIcon } from "./core/Icon";

export const headerBackIconSize = 35;
// const marginIconSize = iconSize * 0.3 * -1;

type HeaderBackProps = {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
};
const HeaderBack = ({ containerStyle, iconStyle }: HeaderBackProps) => {
  const router = useRouter();
  const segment = useSegments();
  const nav = useNavigation<DrawerNavigationProp<{}>>();

  const goBack = useCallback(() => router?.back(), [router]);
  const openDrawer = useCallback(() => nav.openDrawer(), [nav]);
  const canGoBack = !(
    !router?.canGoBack() ||
    (segment.length === 1 && segment[0] === "(main)")
  );

  const IconComponent = I18nManager.isRTL ? ChevronRightIcon : ChevronLeftIcon;
  return (
    <View
      style={[
        { marginEnd: Platform.OS === "android" ? 10 : undefined },
        containerStyle,
      ]}
    >
      {canGoBack ? (
        <Pressable onPress={goBack} hitSlop={10}>
          <IconComponent
            size={headerBackIconSize}
            color={theme.colors.grey}
            onPress={goBack}
            style={iconStyle}
          />
        </Pressable>
      ) : (
        <MenuIcon size={25} color={theme.colors.white} onPress={openDrawer} />
      )}
    </View>
  );
};

export default HeaderBack;
