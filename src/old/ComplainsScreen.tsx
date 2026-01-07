import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import emailsApi, {Email} from '../api/emailsApi';
import {Button, Text} from '../components/core';
import FormScreen from '../components/core/FormScreen';
import {KeyboardView, Picker, TextInput} from '../components/form';
import {screens} from '../config/constants';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useLocale from '../hooks/useLocale';
import useToast from '../hooks/useToast';
import {StackParams} from '../navigation/HomeStack';
import theme from '../styles/theme';
import {complainTypes} from '../data/complainTypes';
import itemsApi from '../api/itemsApi';
type FormValues = {
  subject: string;
  type: string;
  body: string;
};

type complainsRoute = RouteProp<StackParams, typeof screens.COMPLAINS>;

const ComplainsScreen = () => {
  const navigation = useNavigation();
  const {t} = useLocale(screens.COMPLAINS);
  const {loader, request} = useApi();
  const route = useRoute<complainsRoute>();
  const {profile, getName} = useAuth();
  const {showToast, hideToast} = useToast();
  const {control, setFocus, handleSubmit, reset} = useForm<FormValues>({
    subject: yup.string().trim().max(50).required(t('subject.required')),
    type: yup.string().trim().max(50).required(t('type.required')),
    body: yup.string().trim().max(300).required(t('body.required')),
  });

  const onFormSuccess = async (data: FormValues) => {
    try {
      hideToast();
      const email: Omit<Email, 'id'> = {
        subject: data.subject,
        text: data.body,
        userId: profile?.id!,
        user: {
          id: profile?.id!,
          name: getName(),
          email: profile?.email!,
        },
        type: data.type,
        metadata: {
          deviceOS: Platform.OS.toString(),
        },
      };
      if (route.params?.itemId) {
        email.metadata = {
          itemId: route.params?.itemId,
          url: itemsApi.getShareLinkById(route.params?.itemId),
        };
      }

      await request<Email>(() =>
        emailsApi.add(email, {
          analyticsEvent: {
            name: 'send_complain',
            params: {
              complainType: data.type,
            },
          },
        }),
      );
      navigation.goBack();
      showToast({
        type: 'success',
        message: t('submitSuccess'),
        options: {
          duration: 5000,
        },
      });
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  const focusToBody = () => setFocus('body');
  return (
    <FormScreen style={styles.screen} scrollable>
      <Text style={styles.header}>{t('header')}</Text>
      <View style={styles.formContainer}>
        <TextInput
          name="subject"
          placeholder={t('subject.placeholder')}
          returnKeyType="next"
          control={control}
          onSubmitEditing={focusToBody}
          defaultValue={t('subject.defaultValue')}
        />
        <Picker
          position="full"
          searchable
          name="type"
          items={complainTypes}
          placeholder={t('type.placeholder')}
          modalTitle={t('type.modalTitle')}
          control={control}
          // onChange={onSwapChange}
          label="Report type"
        />

        <TextInput
          name="body"
          multiline={true}
          // numberOfLines={5}
          placeholder={t('body.placeholder')}
          control={control}
          inputStyle={styles.messageText}
          returnKeyType="send"
          blurOnSubmit={true}
          returnKeyLabel="Send"
          onSubmitEditing={handleSubmit(onFormSuccess)}
        />
      </View>

      <KeyboardView>
        <Button
          title={t('submitBtnTitle')}
          onPress={handleSubmit(onFormSuccess)}
        />
      </KeyboardView>
      {loader}
    </FormScreen>
  );
};

export default ComplainsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    ...theme.styles.scale.h7,
    textAlign: 'center',
  },
  formContainer: {
    flex: 0.75,
    justifyContent: 'space-around',
  },
  messageText: {
    height: 200,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    textAlignVertical: 'top',
    marginTop: 10,
  },
});
