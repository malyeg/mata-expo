import { Button, Text } from "@/components/core";
import FormScreen from "@/components/core/FormScreen";
import Logo from "@/components/core/Logo";
import TextInput from "@/components/form/TextInput";
import { ICredentials } from "@/contexts/AuthReducer";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useForm from "@/hooks/useForm";
import useKeyboard from "@/hooks/useKeyboard";
import useLocale from "@/hooks/useLocale";
import useSocialLogin from "@/hooks/useSocialLogin";
import useToast from "@/hooks/useToast";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";

export const SIGN_IN_SCREEN_NAME = "SignInScreen";
type SignInFormValues = { username: string; password: string };
const SignInScreen = () => {
  const { t } = useLocale("signInScreen");
  const { showToast, hideToast } = useToast();
  const { keyboardShown } = useKeyboard();
  const { appleLoginEnabled, facebookLoginEnabled, guestLoginEnabled } =
    useSocialLogin();

  const { signIn, fbSignIn, appleSignIn, guestSignIn } = useAuth();
  const { request, loader } = useApi();

  useEffect(() => {
    const loadData = async () => {};
    loadData();
  }, []);

  const { control, handleSubmit, setFocus } = useForm<SignInFormValues>({
    username: yup
      .string()
      .trim()
      .email(t("username.invalid"))
      .max(100)
      .required(t("username.required")),
    password: yup.string().trim().max(100).required(t("password.required")),
  });

  const onFormSuccess = async (data: SignInFormValues) => {
    hideToast();
    const credentials: ICredentials = {
      username: data.username,
      password: data.password,
    };
    try {
      const resp = await request(() => signIn(credentials));
    } catch (err) {
      console.error("SignInScreen.onFormSuccess error", err);
      showToast({
        type: "error",
        code: (err as any).code,
        message: (err as any).message,
      });
    }
  };

  const focusOnPassword = () => setFocus("password");
  const loginWithFB = async () => {
    try {
      await request(() => fbSignIn());
    } catch (err) {
      showToast({
        type: "error",
        code: (err as any).code,
        message: (err as any).message,
      });
    }
  };

  const onAppleButtonPress = async () => {
    await request(() => appleSignIn());
  };
  const signInAsGuest = async () => {
    await request(() => guestSignIn());
  };

  return (
    <FormScreen
      style={styles.screen}
      scrollable
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoContainer}>
        <Logo style={styles.logo} />
      </View>

      {/* <View style={styles.form}> */}
      <TextInput
        keyboardType="email-address"
        name="username"
        placeholder={t("username.placeholder")}
        returnKeyType="next"
        control={control}
        onSubmitEditing={focusOnPassword}
        style={styles.usernameInput}
      />
      <TextInput
        // style={styles.password}
        secureTextEntry
        name="password"
        placeholder={t("password.placeholder")}
        returnKeyType="go"
        returnKeyLabel="Sign in"
        control={control}
        onSubmitEditing={handleSubmit(onFormSuccess)}
        style={styles.passwordInput}
      />

      <View>
        <Button
          title={t("loginBtnTitle")}
          onPress={handleSubmit(onFormSuccess)}
        />
        <Link
          href={{ pathname: "/(auth)/forgot-password" }}
          style={[sharedStyles.link, styles.forgotPasswordLink]}
        >
          {t("forgotPasswordLink")}
        </Link>
      </View>

      {/* </View> */}

      {appleLoginEnabled && (
        <Button
          icon={{ name: "apple", color: theme.colors.white, size: 30 }}
          title={t("appleLoginButtonTitle")}
          style={styles.appleButton}
          onPress={onAppleButtonPress}
        />
      )}

      {facebookLoginEnabled && (
        <Button
          icon={{ name: "facebook", color: theme.colors.white, size: 30 }}
          title={t("facebookLoginButtonTitle")}
          onPress={loginWithFB}
          style={styles.fbButton}
        />
      )}

      {!keyboardShown && (
        <View style={styles.footer}>
          <Text body1>{t("dontHaveAccountText")}</Text>
          <Link
            href={{ pathname: "/(auth)/sign-up" }}
            style={sharedStyles.link}
          >
            {t("signUpLink")}
          </Link>
        </View>
      )}
      {guestLoginEnabled && (
        <Button
          // style={styles.guestButton}
          // body1
          textStyle={styles.guestLink}
          themeType="white"
          title={t("loginGuestBtnTitle")}
          onPress={signInAsGuest}
        />
      )}
      {loader}
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 30,
    justifyContent: "space-around",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
  },
  appleButton: {
    // width: '100%', // You must specify a width
    // height: 45, // You must specify a height
    backgroundColor: "black",
  },
  guestButton: {
    marginTop: 30,
  },
  guestLink: {
    textDecorationLine: "none",
    fontSize: 16,
    fontWeight: "normal",
  },
  header: {
    // flex: 4,
    // flexShrink: 0,
  },
  headerError: {
    // flex: 1,
  },
  form: {
    // flex: 3,
    // flexShrink: 0,
    // justifyContent: 'space-evenly',
    // backgroundColor: 'grey',
  },
  forgotPasswordLink: {
    marginVertical: 20,
    alignSelf: "center",
  },
  usernameInput: {
    marginBottom: 40,
  },
  passwordInput: {
    marginBottom: 20,
  },
  footer: {
    // flex: 2,
    // flexShrink: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  fbButton: {
    backgroundColor: "#4267B2",
  },
});

export default SignInScreen;
