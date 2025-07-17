import {useMemo} from 'react';
import Toast from 'react-native-toast-message';
import {Status} from '../types/DataTypes';
import useLocale from './useLocale';

const useToast = () => {
  const {t} = useLocale();

  const getToastMessage = (status: Status | string) => {
    if (typeof status === 'string') {
      return status;
    } else if (status?.code) {
      const localizedMessage = t('error:' + status.code, {
        defaultValue: status.message,
      });
      return localizedMessage;
    } else if (status?.message) {
      return status.message;
    } else {
      return JSON.stringify(status);
    }
  };

  const toast = useMemo(
    () => ({
      showToast: (status: Status) => {
        Toast.show({
          type: status.type ?? 'success',
          text1: getToastMessage(status),
          visibilityTime: status.options?.duration ?? 2000,
          autoHide: status.options?.autoHide ?? status.type !== 'error',
        });
      },
      showSuccessToast: (message: string) => {
        Toast.show({
          type: 'success',
          text1: getToastMessage(message),
          visibilityTime: 5000,
          autoHide: true,
        });
      },
      showErrorToast: (error: any) => {
        Toast.show({
          type: 'error',
          text1: getToastMessage({code: error.code, message: error.message}),
          autoHide: false,
        });
      },
      hideToast: () => {
        Toast.hide();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return toast;
};

export default useToast;
