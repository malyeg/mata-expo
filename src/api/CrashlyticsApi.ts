import crashlytics from '@react-native-firebase/crashlytics';
import {User} from '../contexts/user-model';

class CrashlyticsApi {
  setUser = (user: User) => {
    return crashlytics().setUserId(user.id);
  };

  crash = () => {
    crashlytics().crash();
  };

  log = (message: string) => {
    crashlytics().log(message);
  };
  recordError = (error: any) => {
    if (!error) {
      return;
    }
    if (error instanceof Error) {
      crashlytics().recordError(error);
    } else if (typeof error === 'string') {
      crashlytics().recordError(new Error(error));
    } else if (typeof error === 'object' && !!error.message) {
      const newError = new Error(error.message);
      (newError as any).code = error.code;
      crashlytics().recordError(newError);
    } else {
      crashlytics().recordError(new Error(JSON.stringify(error)));
    }
  };
}
const crashlyticsApi = new CrashlyticsApi();
export default crashlyticsApi;
