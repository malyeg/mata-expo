import { Button, Icon, Text } from "@/components/core";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface SignUpCardProps {
  style?: StyleProp<ViewStyle>;
}
const SignUpCard = ({ style }: SignUpCardProps) => {
  const { signOut } = useAuth();
  const { t } = useLocale("common");

  const openSignIn = () => {
    signOut();
  };
  return (
    <View style={[styles.container, style]}>
      <Icon
        name="alert-circle"
        style={styles.alertIcon}
        color={theme.colors.white}
        bgColor={"red"}
      />
      <View style={styles.updateTextContainer}>
        <Text style={[styles.updateText]}>
          {t("tabBar.anonymousDialog.body")}
        </Text>
      </View>

      <View>
        <Button
          title={t("tabBar.anonymousDialog.confirmTitle")}
          themeType="white"
          style={styles.updateButton}
          textStyle={styles.updateButtonText}
          onPress={openSignIn}
        />
      </View>
    </View>
  );
};

export default React.memo(SignUpCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 7,
    borderWidth: 1,
    height: 45,
    alignContent: "space-between",
    alignItems: "center",

    borderColor: theme.colors.white,
    backgroundColor: theme.colors.green,
    paddingHorizontal: 5,
  },
  updateTextContainer: {
    flex: 1,
  },
  updateText: {
    textAlign: "left",
    color: theme.colors.white,
    fontSize: 12,
  },
  alertIcon: {
    marginRight: 5,
  },
  updateButton: {
    height: 30,
    backgroundColor: theme.colors.white,
    // marginRight: 5,
  },
  updateButtonText: {
    fontSize: 12,
    marginHorizontal: 10,
  },
});
