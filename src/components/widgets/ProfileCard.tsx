import { Profile } from "@/api/profileApi";
import ratingApi from "@/api/ratingApi";
import useAuth from "@/hooks/useAuth";
import theme from "@/styles/theme";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "../core";
import Card from "../core/Card";
import Star from "./rating/Star";

const profileIconSize = 80;
interface ProfileCardProps {
  profile: Profile;
}
const ProfileCard = ({ profile }: ProfileCardProps) => {
  const { user } = useAuth();
  const rate = useMemo(
    () => (profile?.ratings ? ratingApi.calc(profile?.ratings) : undefined),
    [profile]
  );
  return profile ? (
    <Card style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon
          style={styles.profileIcon}
          name={"profile"}
          color={theme.colors.white}
          size={profileIconSize * 0.5}
          type="custom"
        />
      </View>
      <View style={styles.profileContainer}>
        <Text>
          {user.isAnonymous
            ? "Guest"
            : profile.firstName
            ? profile.firstName + " " + profile.lastName
            : profile.email}
        </Text>
        {rate && (
          <View style={styles.starContainer}>
            <Star index={0} selected size={25} />
            <Text>{rate.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </Card>
  ) : null;
};

export default React.memo(ProfileCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  profileContainer: {
    flex: 1,
    marginLeft: 10,
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
    width: profileIconSize,
    height: profileIconSize,
    borderRadius: profileIconSize / 2,
  },
  starContainer: {
    // justifyContent: 'center',
    alignItems: "center",
    flexDirection: "row",
  },
  profileIcon: {
    // borderWidth: 2,
  },
  userName: {
    ...theme.styles.scale.h5,
  },
});
