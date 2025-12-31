import { ICredentials } from "@/contexts/AuthReducer";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import useApi from "../useApi";
import useAuth from "../useAuth";
import useForm from "../useForm";
import useLocale from "../useLocale";
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
    hideToast();
    const credentials: ICredentials = {
      username: data.username,
      password: data.password,
    };
    try {
      const resp = await signIn(credentials);
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
