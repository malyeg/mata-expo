import { Button, CheckBox, Text } from "@/components/core";
import FormScreen from "@/components/core/FormScreen";
import Logo from "@/components/core/Logo";
import TextInput from "@/components/form/TextInput";
import PasswordMeter from "@/components/widgets/PasswordMeter";
import constants from "@/config/constants";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useForm from "@/hooks/useForm";
import useKeyboard from "@/hooks/useKeyboard";
import useLocale from "@/hooks/useLocale";
import useToast from "@/hooks/useToast";
import { Profile } from "@/models/Profile.model";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { Link } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";
type SignUpFormValues = {
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  phone: string;
  country: string;
  state: string;
  city: string;
  firstName: string;
  lastName: string;
};
const SignUpScreen = () => {
  const { keyboardShown } = useKeyboard();
  const { t } = useLocale("signUpScreen");
  const { loader, request } = useApi();
  const [agreeOnTerms, setAgreeOnTerms] = useState(false);
  const { signUp } = useAuth();
  const { showToast, hideToast } = useToast();

  const { control, handleSubmit, setFocus, watch } = useForm<SignUpFormValues>({
    username: yup
      .string()
      .trim()
      .email()
      .max(100)
      .required(t("username.required")),
    firstName: yup.string().trim().required(t("firstName.required")),
    lastName: yup.string().trim().required(t("lastName.required")),
    password: yup
      .string()
      .trim()
      .max(200)
      .required(t("password.required"))
      .matches(constants.auth.PASSWORD_PATTERN, t("password.pattern")),
    confirmPassword: yup
      .string()
      .test("passwords-match", t("confirmPassword.match"), function (value) {
        return this.parent.password === value;
      }),
    terms: yup.boolean().oneOf([true], t("terms.required")),
  });

  const onTermsAgree = useCallback((v: boolean) => {
    setAgreeOnTerms(v);
  }, []);

  const onFormSuccess = async (data: SignUpFormValues) => {
    hideToast();
    try {
      const profile: Omit<Profile, "id"> = {
        email: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        acceptTermsFlag: data.terms ? true : false,
        acceptMarketingFlag: true,
      };
      await request<Profile>(() =>
        signUp(data.username, data.password, profile as Profile)
      );
    } catch (err: any) {
      showToast({
        type: "error",
        code: err.code,
        message: (err as any).message,
      });
    }
  };

  const focusOnFirstName = () => setFocus("firstName");
  const focusOnLastName = () => setFocus("lastName");
  const focusOnConfirmPassword = () => setFocus("confirmPassword");

  const password = watch("password");
  return (
    <FormScreen style={styles.screen} scrollable>
      {!keyboardShown && (
        <View style={styles.logoContainer}>
          <Logo style={[styles.logo]} />
        </View>
      )}

      <TextInput
        keyboardType="email-address"
        name="username"
        placeholder={t("username.placeholder")}
        returnKeyType="next"
        control={control}
        onSubmitEditing={focusOnFirstName}
        hideLabel={keyboardShown}
      />
      <TextInput
        name="firstName"
        placeholder={t("firstName.placeholder")}
        returnKeyType="next"
        control={control}
        onSubmitEditing={focusOnLastName}
        hideLabel={keyboardShown}
      />
      <TextInput
        name="lastName"
        placeholder={t("lastName.placeholder")}
        returnKeyType="next"
        control={control}
        hideLabel={keyboardShown}
      />

      <TextInput
        secureTextEntry
        name="password"
        placeholder={t("password.placeholder")}
        returnKeyType="next"
        control={control}
        onSubmitEditing={focusOnConfirmPassword}
        hideLabel={keyboardShown}
      />
      <View>
        <TextInput
          secureTextEntry
          name="confirmPassword"
          placeholder={t("confirmPassword.placeholder")}
          returnKeyType="next"
          control={control}
          hideLabel={keyboardShown}
        />

        {!!password && (
          <PasswordMeter style={styles.meter} password={password} />
        )}
      </View>

      <View style={styles.termsContainer}>
        <CheckBox
          style={styles.termsCheckbox}
          value={agreeOnTerms}
          onChange={onTermsAgree}
        />
        <Link href={{ pathname: "/(auth)/legal-information" }}>
          <Text style={styles.termsLink}>{t("terms.label")}</Text>
        </Link>
      </View>

      <Button
        disabled={!agreeOnTerms}
        title={t("registerBtnTitle")}
        onPress={handleSubmit(onFormSuccess)}
      />

      {!keyboardShown && (
        <View style={styles.footer}>
          <Text body1>{t("haveAccountText")}</Text>
          <Link
            href={{ pathname: "/(auth)/sign-in" }}
            style={sharedStyles.link}
          >
            {t("LoginLink")}
          </Link>
        </View>
      )}
      {loader}
    </FormScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  state: {
    flexBasis: "48%",
  },
  city: {
    flexBasis: "48%",
  },
  rowContainer: {
    // flexDirection: 'row',
    // flexGrow: 0,
    // backgroundColor: 'red',
    // justifyContent: 'space-between',
  },
  logoContainer: {
    // flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    // flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'grey',
  },
  formContainer: {
    // flex: 0.75,
    flexGrow: 1,
    // flexShrink: 0,
    justifyContent: "space-between",
  },
  phoneContainer: {
    flexDirection: "row",
  },
  countryCode: {
    marginRight: 20,
    // width: '20%',
  },

  conditionsText: {
    alignItems: "center",
  },
  location: {
    // flexBasis: '48%',
    // backgroundColor: 'grey',
  },
  phone: {
    flexBasis: "70%",
    // backgroundColor: 'red',
  },
  phoneCode: {
    flexBasis: "25%",
    // backgroundColor: 'grey',
  },
  termsCheckbox: {
    // paddingVertical: 10,
    // marginVertical: 20,
    marginRight: 10,
  },
  footer: {
    // flex: 1,
    // flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  termsLink: {
    ...sharedStyles.link,
    ...theme.styles.scale.body1,
    textDecorationLine: "underline",
  },
  termsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  meter: {
    marginTop: 10,
  },
});

export default SignUpScreen;
