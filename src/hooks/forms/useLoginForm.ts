import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useForm from "../useForm";
import * as yup from "yup";
import useLocale from "../useLocale";
import useAuth from "../useAuth";
import useApi from "../useApi";
import { ICredentials } from "@/contexts/AuthReducer";
import useSocialLogin from "../useSocialLogin";
import useToast from "../useToast";

type SignInFormValues = { username: string; password: string };

const useLoginForm = () => {
  const { t } = useLocale("signInScreen");
  const { signIn, fbSignIn, appleSignIn, guestSignIn } = useAuth();
  const socialLoginMethods = useSocialLogin();
  const { request, loader } = useApi();
  const { showToast, hideToast } = useToast();
  const methods = useForm<SignInFormValues>({
    username: yup
      .string()
      .trim()
      .email(t("username.invalid"))
      .max(100)
      .required(t("username.required")),
    password: yup.string().trim().max(100).required(t("password.required")),
  });

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

  const loginWithApple = async () => {
    await request(() => appleSignIn());
  };
  const signInAsGuest = async () => {
    await request(() => guestSignIn());
  };

  const loginWithCredentials = async (data: SignInFormValues) => {
    console.log("loginWithCredentials", data);
    hideToast();
    const credentials: ICredentials = {
      username: data.username,
      password: data.password,
    };
    try {
      const resp = await signIn(credentials);
      console.log("signIn resp", resp);
    } catch (err) {
      showToast({
        type: "error",
        code: (err as any).code,
        message: (err as any).message,
      });
    }
  };
  return {
    ...methods,
    ...socialLoginMethods,
    loginWithFB,
    loginWithApple,
    signInAsGuest,
    onsubmit: methods.handleSubmit(loginWithCredentials),
  };
};

export default useLoginForm;

const styles = StyleSheet.create({});
