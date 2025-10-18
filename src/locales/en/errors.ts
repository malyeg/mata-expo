export default {
  ['auth/user-not-found']: 'User not found',
  ['auth/user-disabled']: 'User is disabled',
  ['auth/facebook/loginCanceled']: 'Login Canceled',
  ['auth/invalid-email']: 'Invalid email',
  ['auth/wrong-password']: 'Invalid credentials',
  ['auth/weak-password']: 'Password should be at least 6 characters',
  ['auth/network-request-failed']:
    'A network error has occurred, please try again.',
  ['auth/email-already-in-use']: 'Email already in use',
  ['auth/missing-android-pkg-name']:
    'An Android package name must be provided if the Android app is required to be installed.',
  ['auth/missing-continue-uri']:
    'A continue URL must be provided in the request.',
  ['auth/missing-ios-bundle-id']:
    'An iOS Bundle ID must be provided if an App Store ID is provided.',
  ['auth/invalid-continue-uri']:
    'The continue URL provided in the request is invalid.',
  ['auth/unauthorized-continue-uri']:
    'The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.',
  ['storage/imageMaxSize']: 'Max file size of {{maxSize}} reached',

  ['firestore/permission-denied']: 'Permission denied',
  ['firestore/failed-precondition']:
    'Unknown error while fetching data, please contact administrator',

  // location errors
  ['location/permissionDenied']: 'Permission denied',
  ['location/simCountryNotFound']: 'Unable to retrieve location',
  ['location/serviceNotAvailable']: 'Unable to retrieve location',

  // app errors
  ['app/noInternetConnection']: 'You are offline',
  ['app/noConnection']: 'You are offline',
  ['app/unknown']: 'Unknown error',
};
