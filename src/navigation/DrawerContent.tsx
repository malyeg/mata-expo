import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import React, { useCallback } from "react";
import { Platform, StyleSheet } from "react-native";
import ProfileHeader from "../components/widgets/ProfileHeader";
import { screens } from "../config/constants";
import useAuth from "../hooks/useAuth";
import useLocale from "../hooks/useLocale";

import { useNotificationStore } from "@/store/notification-store";
import { theme } from "../styles/theme";
import DrawerItem from "./DrawerItem";

const DrawerContent = ({
  navigation,
  ...props
}: DrawerContentComponentProps) => {
  const { t } = useLocale("common");
  // const [notificationCount, setNotificationCount] = useState(0);
  const { user, signOut } = useAuth();
  const { notificationsCount } = useNotificationStore();

  const openEditProfile = useCallback(() => {
    !user?.isAnonymous && navigation.navigate(screens.PROFILE);
  }, [navigation, user?.isAnonymous]);

  const signInLink = () => {
    signOut();
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <ProfileHeader
        style={styles.header}
        userNameStyle={styles.profileName}
        onPress={openEditProfile}
        showEditIcon={!user?.isAnonymous}
      />

      {user?.isAnonymous && (
        <DrawerItem
          label={t("drawer.signInLabel")}
          icon="login"
          onPress={signInLink}
        />
      )}
      {!user?.isAnonymous && (
        <>
          <DrawerItem
            label={t("drawer.myItemsLabel")}
            icon="view-list-outline"
            to="items"
          />
          <DrawerItem
            label={t("drawer.dealsLabel")}
            icon="handshake"
            iconStyle={styles.dealsIcon}
            to={screens.DEALS_TABS}
          />

          <DrawerItem
            label={t("drawer.profileLabel")}
            icon="account-outline"
            to="account"
          />
          <DrawerItem
            label={t("drawer.notificationsLabel")}
            icon="bell-outline"
            badge={notificationsCount}
            to="notifications"
          />
        </>
      )}

      <DrawerItem label={t("drawer.faqLabel")} icon="help" to="faqs" />
      {Platform.OS !== "ios" && (
        <DrawerItem
          label={t("drawer.supportUsLabel")}
          icon="gift-outline"
          to={screens.SUPPORT_US}
        />
      )}
      <DrawerItem
        label={t("drawer.contactUsLabel")}
        icon="phone"
        to={screens.CONTACT_US}
      />
      <DrawerItem
        label={t("drawer.legal")}
        icon="lock-alert-outline"
        to={screens.LEGAL_INFORMATION}
      />

      {/* <Pressable onPress={toggleLanguage}>
        <MaterialIcons name="language" size={24} color="white" />
        <Text>{t("drawer.localeLabel")}</Text>
      </Pressable> */}

      {(user?.isAdmin || user?.isTester) && (
        <DrawerItem
          label="System"
          icon="information-outline"
          to={screens.SYSTEM}
        />
      )}
      {__DEV__ && user?.isAdmin && (
        <DrawerItem label="Test" icon="information-outline" to={screens.TEST} />
      )}
    </DrawerContentScrollView>
  );
};

export default React.memo(DrawerContent);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  header: {
    marginBottom: 40,
  },
  profileName: {
    ...theme.styles.scale.subtitle1,
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
    marginHorizontal: 30,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  dealsIcon: {
    transform: [{ rotate: "40deg" }],
  },
  separator: { borderTopWidth: 2, borderColor: theme.colors.lightGrey },
  section: {
    paddingVertical: 5,
  },
});
