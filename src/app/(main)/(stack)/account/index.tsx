import { Button, Modal, Screen, Text } from "@/components/core";
import ProfileHeader from "@/components/widgets/ProfileHeader";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import useSocial from "@/hooks/useSocial";
import React, { FC, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
// import useSocial from '@/hooks/useSocial';
import { ChevronIcon } from "@/components/core/Icon";
import theme from "@/styles/theme";
import { useRouter } from "expo-router";

const ProfileScreen = () => {
  const { signOut, deleteAccount } = useAuth();
  const { t } = useLocale("profileScreen");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const { shareUrl } = useSocial();
  const router = useRouter();
  const { loader, request } = useApi();

  const closeModal = () => {
    setLogoutModalVisible(false);
  };
  const closeLogoutModal = () => setLogoutModalVisible(true);
  const openDeleteAccountModal = () => setDeleteAccountModalVisible(true);
  const closeDeleteAccountModal = () => setDeleteAccountModalVisible(false);

  const editLink = () => router.navigate("/account/edit-profile");
  const changePasswordLink = () => router.navigate("/account/change-password");
  const myItemsLink = () => router.navigate("/account/my-items");
  const wishListLink = () => router.navigate("/account/wish-list");

  const onDeleteAccount = async () => {
    setDeleteAccountModalVisible(false);
    await request(deleteAccount);
  };
  return (
    <Screen style={styles.container} scrollable={true}>
      <ProfileHeader
        style={styles.profileHeader}
        userNameStyle={styles.profileNameText}
        icon={{ color: theme.colors.grey }}
        iconContainerStyle={styles.iconContainer}
      />
      <ScrollView style={styles.itemsView}>
        <ProfileItem title={t("editProfileLink")} onPress={editLink} />

        <ProfileItem
          title={t("changePasswordLink")}
          onPress={changePasswordLink}
        />
        <ProfileItem title={t("myItemsLink")} onPress={myItemsLink} />

        <ProfileItem title={t("inviteUserTitle")} onPress={shareUrl} />
        <ProfileItem title={t("wishListTitle")} onPress={wishListLink} />

        <ProfileItem
          // style={styles.logout}
          titleStyle={styles.logoutText}
          title={t("deleteAccount.link")}
          onPress={openDeleteAccountModal}
          chevron={false}
        />

        <ProfileItem
          style={styles.logout}
          titleStyle={styles.logoutText}
          title={t("logout.logoutLink")}
          onPress={closeLogoutModal}
          chevron={false}
        />
      </ScrollView>

      <Modal
        isVisible={logoutModalVisible}
        position="bottom"
        onClose={closeModal}
        title={t("logout.confirmLogoutTitle")}
        // containerStyle={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.confirmLogoutText}>
            {t("logout.confirmLogoutText")}
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button
              themeType="white"
              title={t("logout.cancelBtnTitle")}
              style={[styles.modalButton]}
              onPress={closeModal}
            />
            <Button
              title={t("logout.confirmLogoutBtnTitle")}
              style={styles.modalButton}
              onPress={signOut}
            />
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={deleteAccountModalVisible}
        position="bottom"
        onClose={closeDeleteAccountModal}
        title={t("deleteAccount.confirmTitle")}
        // containerStyle={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.confirmLogoutText}>
            {t("deleteAccount.confirmText")}
          </Text>
          <View style={styles.modalButtonContainer}>
            <Button
              themeType="white"
              title={t("deleteAccount.cancelBtnTitle")}
              style={[styles.modalButton]}
              onPress={closeDeleteAccountModal}
            />
            <Button
              title={t("deleteAccount.confirmBtnTitle")}
              style={styles.modalButton}
              onPress={onDeleteAccount}
            />
          </View>
        </View>
      </Modal>
      {loader}
    </Screen>
  );
};

type ProfileItemProps = {
  title: string;
  onPress: () => void;
  chevron?: boolean;
  titleStyle?: TextStyle;
  style?: ViewStyle;
};
const ProfileItem: FC<ProfileItemProps> = ({
  title,
  chevron = true,
  onPress,
  titleStyle,
  style,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.itemContainer, style]}>
      <Text style={[styles.itemText, titleStyle]}>{title}</Text>
      {chevron && (
        <ChevronIcon
          color={theme.colors.grey}
          size={35}
          style={styles.chevronIcon}
        />
      )}
    </Pressable>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { paddingBottom: 50 },
  itemsView: {},
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  profileHeader: {
    marginBottom: 40,
  },
  profileNameText: {
    ...theme.styles.scale.h6,
    // color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
    // marginHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: theme.colors.lightGrey,
  },
  profileIcon: {
    color: theme.colors.dark,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    borderBottomColor: theme.colors.lightGrey,
    borderBottomWidth: 2,
  },

  userName: {
    ...theme.styles.scale.h5,
  },
  itemText: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
  },
  chevronIcon: {
    marginRight: -10,
  },
  logout: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: theme.colors.salmon,
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 40,
    marginBottom: 40,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  confirmLogoutTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
  },
  confirmLogoutText: {
    ...theme.styles.scale.h6,
  },
  modal: {
    // flex: 1,
    // height: 200,
  },
  modalContainer: {
    // flex: 1,
    // height: 200,
  },
});
