import { fromFirebaseUser, User } from "@/contexts/user-model";
import { Profile } from "@/models/Profile.model";
import auth, { firebase, FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseFunctionsTypes } from "@react-native-firebase/functions";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { ICredentials } from "../contexts/AuthReducer";
import Analytics from "../utils/Analytics";
import { AppError } from "../utils/AppError";
import { LoggerFactory } from "../utils/logger";
import { Api } from "./Api";
import locationApi from "./locationApi";
import profilesApi from "./profileApi";
import { functions } from "@/firebase";
const logger = LoggerFactory.getLogger("authApi");

export interface PublicUser {
  id: string;
  name: string;
  displayName: string;
  email?: string;
  isProfilePublic?: boolean;
}
class AuthApi extends Api {
  functions: FirebaseFunctionsTypes.Module;
  constructor() {
    super();
    this.functions = functions;
  }

  signIn = async (credentials: ICredentials) => {
    try {
      const userCredentials = await auth().signInWithEmailAndPassword(
        credentials.username,
        credentials.password
      );
      const userRules = await this.getUserRules();
      if (userCredentials) {
        Analytics.logLogin("CREDENTIALS");
        return await fromFirebaseUser(userCredentials.user, userRules);
      }
    } catch (error) {
      const err = (error as any).code ?? (error as any).message;
      Analytics.logEvent("login_error", { error: err });
      throw error;
    }
  };
  guestSignIn = async () => {
    try {
      const userCredentials = await auth().signInAnonymously();
      const userRules = await this.getUserRules();
      if (userCredentials) {
        Analytics.logLogin("GUEST");
        return await fromFirebaseUser(userCredentials.user, userRules);
      }
    } catch (error) {
      const err = (error as any).code ?? (error as any).message;
      Analytics.logEvent("login_error", { error: err });
      throw error;
    }
  };

  signUp = async (
    credentials: ICredentials,
    newProfile: Omit<Profile, "id">
  ) => {
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(
        credentials.username,
        credentials.password
      );

      if (userCredentials) {
        userCredentials.user.sendEmailVerification();
        const profile: Profile = {
          ...newProfile,
          id: userCredentials.user.uid,
        };
        await profilesApi.set(userCredentials.user.uid, profile);
        const user = await fromFirebaseUser(userCredentials.user);
        Analytics.logSignUp("CREDENTIALS", user);
        return { user, profile };
      }
    } catch (error) {
      const err = (error as any).code ?? (error as any).message;
      Analytics.logEvent("login_error", { error: err });
      throw error;
    }
  };

  sendPasswordResetEmail = async (email: string) => {
    await auth().sendPasswordResetEmail(email);
    Analytics.logForgotPassword(email);
  };

  changePassword = async (crednetials: ICredentials, newPassword: string) => {
    try {
      const user = auth().currentUser;
      const provider = firebase.auth.EmailAuthProvider;
      const authCredential: FirebaseAuthTypes.AuthCredential =
        provider.credential(crednetials.username, crednetials.password);
      const userCredential = await user!.reauthenticateWithCredential(
        authCredential
      );
      await userCredential.user.updatePassword(newPassword);
      Analytics.logEvent("change_password");
    } catch (error) {
      const err = (error as any).code ?? (error as any).message;
      Analytics.logEvent("change_password_error", { error: err });
      throw error;
    }
  };

  getUser = () => {
    return auth().currentUser;
  };

  signOut = async () => {
    const promises: Promise<void>[] = [
      profilesApi.removeFromStorage(),
      locationApi.removeLastKnownLocation(),
      auth().signOut(),
    ];
    LoginManager.logOut();
    await Promise.all(promises);
    Analytics.logSignOut();
  };
  deleteAccount = async () => {
    await this.functions.httpsCallable("deleteAccount")();
    Analytics.logEvent("delete_account");
  };

  onAuthStateChanged = (
    listnerCallback: (user: FirebaseAuthTypes.User | null) => void
  ) => {
    return auth().onAuthStateChanged(listnerCallback);
  };

  getUserRules = async () => {
    const rules = ["user"];
    const idTokenResult = await auth().currentUser?.getIdTokenResult();
    if (idTokenResult) {
      const claims = idTokenResult.claims;
      if (claims.admin && claims.admin === true) {
        rules.push("admin");
      }
    }
    return rules;
  };

  appleSignIn = async () => {
    try {
      // const appleAuthRequestResponse = await appleAuth.performRequest({
      //   requestedOperation: appleAuth.Operation.LOGIN,
      //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      // });
      // const { identityToken, nonce, fullName } = appleAuthRequestResponse;
      // if (identityToken) {
      //   const appleCredential = firebase.auth.AppleAuthProvider.credential(
      //     identityToken,
      //     nonce
      //   );
      //   const userCredential = await firebase
      //     .auth()
      //     .signInWithCredential(appleCredential);
      //   const user = this.fromApple(userCredential);
      //   let profile = await profilesApi.getById(user.id);
      //   if (profile) {
      //     logger.debug("profile found", profile.id);
      //   } else {
      //     profile = {
      //       email: user.email,
      //       id: user.id,
      //     } as Profile;
      //     !!fullName?.givenName && (profile.firstName = fullName?.givenName);
      //     !!fullName?.familyName && (profile.lastName = fullName?.familyName);
      //     profilesApi.set(user.id, profile);
      //   }
      //   Analytics.logLogin("APPLE");
      //   return { user, profile };
      // } else {
      //   console.log("no identityToken");
      //   // handle this - retry?
      // }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  fbSignIn = async () => {
    try {
      logger.debug("fbSignIn");
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        const error = new AppError(
          "auth/facebook/loginCanceled",
          "User cancelled the login process"
        );
        throw error;
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        const error = new AppError(
          "app/unknown",
          "Something went wrong obtaining access token"
        );
        throw error;
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      logger.debug("fbSignIn => signInWithCredential");
      const fbUser = await auth().signInWithCredential(facebookCredential);

      if (fbUser) {
        logger.log("fbSignIn => fbUser");
        const userRules = await this.getUserRules();
        Analytics.logLogin("FACEBOOK");
        const existingProfile = await profilesApi.getById(fbUser.user.uid);
        const { user, profile } = await this.fromFaceBook(fbUser, userRules);
        let newProfile: Profile;
        if (existingProfile) {
          logger.log("fbSignIn=> profile found, updating", existingProfile);
          newProfile = {
            ...existingProfile,
            ...profile,
          };
        } else {
          console.log("profile not found, updating");
          newProfile = {
            ...profile,
          };
        }
        await profilesApi.set(user.id, newProfile);

        return { user, profile: newProfile };
      } else {
        throw new AppError(
          "app/unknown",
          "Something went wrong while obtaining access token"
        );
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  fromFaceBook = (
    faceBookUser: FirebaseAuthTypes.UserCredential,
    rules?: string[]
  ) => {
    const fbUser = faceBookUser.user;
    const fbProfile = faceBookUser.additionalUserInfo?.profile;
    const user: User = {
      id: fbUser.uid,
      username: fbUser.email!,
      email: fbUser.email!,
      emailVerified: fbUser.emailVerified,
      type: "facebook",
      isAnonymous: false,
      metadata: {
        lastSignInTime: Number(fbUser.metadata.lastSignInTime),
        creationTime: Number(fbUser.metadata.creationTime),
      },
    };
    const profile: Profile = {
      id: fbUser.uid,
      email: fbUser.email!,
    };
    if (fbProfile) {
      profile.image = {
        ...fbProfile?.picture.data,
        isSilhouette: fbProfile?.picture.data.is_silhouette ?? true,
      };
      profile.fullName = fbProfile.display_name!;
      profile.firstName = fbProfile.first_name;
      profile.lastName = fbProfile.last_name;
      // profile.middleName = fbProfile.middle_name;
    }

    if (rules && rules.length > 0) {
      user.rules = [...rules];
      if (rules.includes("admin")) {
        user.isAdmin = true;
      }
    }
    return { user, profile };
  };

  private fromApple(userCredential: FirebaseAuthTypes.UserCredential) {
    const user: User = {
      id: userCredential.user.uid,
      username: userCredential.user.email!,
      email: userCredential.user.email!,
      emailVerified: userCredential.user.emailVerified,
      type: "apple",
      isAnonymous: false,
    };
    return user;
  }
}

const authApi = new AuthApi();

export default authApi;
