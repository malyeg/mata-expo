import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {Platform} from 'react-native';

// https://github.com/react-navigation/react-navigation/pull/8987
const useMessaging = () => {
  useEffect(() => {
    if (
      Platform.OS === 'ios' &&
      !messaging().isDeviceRegisteredForRemoteMessages
    ) {
      if (!__DEV__) {
        messaging().registerDeviceForRemoteMessages();
      }
    }
  }, []);

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.warn("couldn't get token", error);
    }
  };

  const onTokenRefresh = (callback: (token: string) => void) => {
    return messaging().onTokenRefresh(token => {
      callback(token);
    });
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

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
