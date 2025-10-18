import {useNetInfo} from '@react-native-community/netinfo';
import {useEffect, useRef, useState} from 'react';
import {LoggerFactory} from '../utils/logger';

const logger = LoggerFactory.getLogger('useConnectionCheck');
const useConnectionCheck = (
  {delay, trials, reachableOnStart} = {
    delay: 2000,
    trials: 3,
    reachableOnStart: true,
  },
) => {
  const connectionCountRef = useRef(0);
  const netInfo = useNetInfo();
  const [isInternetReachable, setInternetReachable] =
    useState<boolean>(reachableOnStart);
  useEffect(() => {
    let id: any;
    if (!netInfo.isInternetReachable) {
      if (connectionCountRef.current > 0) {
        return;
      }
      id = setInterval(() => {
        logger.debug('setInterval', connectionCountRef.current);
        if (netInfo.isInternetReachable) {
          connectionCountRef.current = 0;
          setInternetReachable(true);
          clearInterval(id);
        } else if (trials > 0 && connectionCountRef.current >= trials - 1) {
          setInternetReachable(false);
          clearInterval(id);
        } else {
          connectionCountRef.current = connectionCountRef.current += 1;
        }
      }, delay);
    } else {
      setInternetReachable(true);
      connectionCountRef.current = 0;
      clearInterval(id);
    }
    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [delay, netInfo.isInternetReachable, trials]);
  return {
    isInternetReachable,
  };
};

export default useConnectionCheck;
