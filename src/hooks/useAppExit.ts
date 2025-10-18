import {useNavigation} from '@react-navigation/core';
import {useEffect} from 'react';
import {Alert, BackHandler} from 'react-native';
import {LoggerFactory} from '../utils/logger';
import useLocale from './useLocale';

const logger = LoggerFactory.getLogger('useAppExit');
const useAppExit = () => {
  const navigation = useNavigation();
  const {t} = useLocale('app');

  useEffect(() => {
    const backAction = () => {
      logger.log('back handler init');
      if (!navigation.canGoBack()) {
        logger.log('back handler: no nav');
        Alert.alert(t('exitModal.title'), t('exitModal.body'), [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation, t]);

  return {};
};

export default useAppExit;
