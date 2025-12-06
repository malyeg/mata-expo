import {
  getToken as firebaseGetToken,
  onTokenRefresh as firebaseOnTokenRefresh,
  requestPermission,
  registerDeviceForRemoteMessages,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { messaging } from '../firebase';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// https://github.com/react-navigation/react-navigation/pull/8987
const useMessaging = () => {
  useEffect(() => {
    if (
      Platform.OS === 'ios' &&
      !messaging.isDeviceRegisteredForRemoteMessages
    ) {
      if (!__DEV__) {
        registerDeviceForRemoteMessages(messaging);
      }
    }
  }, []);

  const getToken = async () => {
    try {
      const token = await firebaseGetToken(messaging);
      return token;
    } catch (error) {
      console.warn("couldn't get token", error);
    }
  };

  const onTokenRefresh = (callback: (token: string) => void) => {
    return firebaseOnTokenRefresh(messaging, token => {
      callback(token);
    });
  };

  const requestUserPermission = async () => {
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    return enabled;
  };

  return {
    requestUserPermission,
    getToken,
    onTokenRefresh,
    // subscribe,
  };
};

export default useMessaging;
