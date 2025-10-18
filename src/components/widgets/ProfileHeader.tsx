import ratingApi from "@/api/ratingApi";
import { useAuthStore } from "@/store/auth-store";
import theme from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Icon, Image, Text } from "../core";
import { IconProps } from "../core/Icon";
import AppInfo from "./AppInfo";
import Rate from "./rating/Rate";

interface ProfileHeaderProps extends ViewProps {
  userNameStyle?: StyleProp<TextStyle>;
  icon?: Partial<IconProps>;
  showEditIcon?: boolean;
  iconContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
const IMAGE_SIZE = 110;
const ProfileHeader = ({
  style,
  userNameStyle,
  iconContainerStyle,
  icon,
  showEditIcon,
  onPress,
}: ProfileHeaderProps) => {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [rate, setRate] = useState<number | undefined>();

  useEffect(() => {
    if (profile?.ratings) {
      const newRate = ratingApi.calc(profile?.ratings);
      if (newRate && newRate > 0) {
        setRate(newRate);
      }
    }
  }, [profile?.ratings]);

  const openEditProfile = useCallback(() => {
    router.push("/account/edit-profile");
  }, [router]);
  const profileIconSize = icon?.size ?? IMAGE_SIZE;
  return (
    <Pressable style={[styles.container, style]} hitSlop={10} onPress={onPress}>
      <View
        style={[
          styles.iconContainer,
          iconContainerStyle,
          {
            width: profileIconSize,
            height: profileIconSize,
            borderRadius: profileIconSize / 2,
          },
        ]}
      >
        {profile?.image ? (
          <Image uri={profile.image.url} style={styles.profileImage} />
        ) : (
          <Icon
            style={[styles.profileIcon, icon?.style]}
            name={icon?.name ?? "profile"}
            color={icon?.color ?? theme.colors.white}
            // size={icon?.size ?? profileIconSize * 0.5}
            size={IMAGE_SIZE}
            type={icon?.type ?? "custom"}
          />
        )}
      </View>
      <View style={styles.nameContainer}>
        <Text
          style={[styles.userName, userNameStyle]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {user?.isAnonymous
            ? "Guest"
            : profile?.firstName
            ? profile.firstName + " " + profile.lastName
            : profile?.email}
        </Text>
        {showEditIcon && (
          <Pressable onPress={openEditProfile} hitSlop={10}>
            <Icon name="pencil" size={20} style={styles.editIcon} />
          </Pressable>
        )}
      </View>
      {rate && <Rate value={rate} />}
      {(user?.isAdmin || user?.isTester) && <AppInfo style={styles.appInfo} />}
    </Pressable>
  );
};

export default React.memo(ProfileHeader);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    // height: 200,
  },
  header: {
    marginBottom: 40,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.salmon,
    overflow: "hidden",
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: "row",
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'grey',
  },
  profileIcon: {
    // borderWidth: 2,
  },
  editIcon: {
    color: theme.colors.grey,
    marginLeft: -20,
    // backgroundColor: 'red',
    // backgroundColor: 'red',
  },
  userName: {
    textAlign: "center",
    ...theme.styles.scale.h5,
  },
  profileImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  appInfo: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
