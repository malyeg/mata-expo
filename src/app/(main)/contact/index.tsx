import emailsApi, { Email } from "@/api/emailsApi";
import { Button } from "@/components/core";
import FormScreen from "@/components/core/FormScreen";
import { TextInput } from "@/components/form";
import { screens } from "@/config/constants";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useForm from "@/hooks/useForm";
import useLocale from "@/hooks/useLocale";
import useToast from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import * as yup from "yup";

type FormValues = {
  subject: string;
  body: string;
};

// type contactUsRoute = RouteProp<StackParams, typeof screens.CONTACT_US>;

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const { t } = useLocale(screens.CONTACT_US);
  const { loader, request } = useApi();
  const { profile, getName } = useAuth();
  const { showToast, hideToast } = useToast();
  const { control, setFocus, handleSubmit, reset } = useForm<FormValues>({
    subject: yup.string().trim().max(50).required(t("subject.required")),
    body: yup.string().trim().max(300).required(t("body.required")),
  });

  const onFormSuccess = async (data: FormValues) => {
    //   emailsApi.add(data);
    try {
      hideToast();
      const email: Omit<Email, "id"> = {
        subject: data.subject,
        text: data.body,
        userId: profile?.id!,
        user: {
          id: profile?.id!,
          displayName: profile?.fullName!,
          name: getName(),
          email: profile?.email!,
        },
        type: "other",
        metadata: {
          deviceOS: Platform.OS.toString(),
        },
      };

      await request<Email>(() =>
        emailsApi.add(email, {
          analyticsEvent: {
            name: "contact_us",
          },
        })
      );
      navigation.goBack();
      showToast({
        type: "success",
        message: t("submitSuccess"),
        options: {
          duration: 5000,
        },
      });
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  const focusToBody = () => setFocus("body");
  return (
    <FormScreen
      style={styles.screen}
      scrollable
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        name="subject"
        placeholder={t("subject.placeholder")}
        returnKeyType="next"
        control={control}
        onSubmitEditing={focusToBody}
      />

      <TextInput
        name="body"
        multiline={true}
        placeholder={t("body.placeholder")}
        control={control}
        inputStyle={styles.messageText}
        returnKeyType="send"
        blurOnSubmit={true}
        returnKeyLabel="Send"
        onSubmitEditing={handleSubmit(onFormSuccess)}
      />

      <Button
        title={t("submitBtnTitle")}
        onPress={handleSubmit(onFormSuccess)}
      />
      {loader}
    </FormScreen>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  messageText: {
    height: 200,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    textAlignVertical: "top",
    marginTop: 10,
  },
});
