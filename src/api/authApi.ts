import { Profile } from "@/models/Profile.model";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  FirebaseAuthTypes,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signOut as firebaseSignOut,
  reauthenticateWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  updatePassword,
} from "@react-native-firebase/auth";
import { ICredentials } from "../contexts/AuthReducer";
import { fromFirebaseUser, User } from "../contexts/user-model";
import { auth, callFunction } from "../firebase";
import Analytics from "../utils/Analytics";
import { Api } from "./Api";
import locationApi from "./locationApi";
import profilesApi from "./profileApi";

export interface PublicUser {
  id: string;
  name: string;
  displayName: string;
  email?: string;
  isProfilePublic?: boolean;
}
class AuthApi extends Api {
  signIn = async (credentials: ICredentials) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
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
      const userCredentials = await signInAnonymously(auth);
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
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
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
    await firebaseSendPasswordResetEmail(auth, email);
    Analytics.logForgotPassword(email);
  };

  changePassword = async (crednetials: ICredentials, newPassword: string) => {
    try {
      const user = auth.currentUser;
      const authCredential: FirebaseAuthTypes.AuthCredential =
        EmailAuthProvider.credential(
          crednetials.username,
          crednetials.password
        );
      const userCredential = await reauthenticateWithCredential(
        user!,
        authCredential
      );
      await updatePassword(userCredential.user, newPassword);
      Analytics.logEvent("change_password");
    } catch (error) {
      const err = (error as any).code ?? (error as any).message;
      Analytics.logEvent("change_password_error", { error: err });
      throw error;
    }
  };

  getUser = () => {
    return auth.currentUser;
  };

  signOut = async () => {
    const promises: Promise<void>[] = [
      profilesApi.removeFromStorage(),
      locationApi.removeLastKnownLocation(),
      firebaseSignOut(auth),
    ];
    await Promise.all(promises);
    Analytics.logSignOut();
  };
  deleteAccount = async () => {
    await callFunction("deleteAccount")();
    Analytics.logEvent("delete_account");
  };

  onAuthStateChanged = (
    listnerCallback: (user: FirebaseAuthTypes.User | null) => void
  ) => {
    return auth.onAuthStateChanged(listnerCallback);
  };

  getUserRules = async () => {
    const rules = ["user"];
    const idTokenResult = await auth.currentUser?.getIdTokenResult();
    if (idTokenResult) {
      const claims = idTokenResult.claims;
      if (claims.admin && claims.admin === true) {
        rules.push("admin");
      }
    }
    return rules;
  };

  appleSignIn = async () => {
    // try {
    //   const appleAuthRequestResponse = await appleAuth.performRequest({
    //     requestedOperation: appleAuth.Operation.LOGIN,
    //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    //   });
    //   const {identityToken, nonce, fullName} = appleAuthRequestResponse;
    //   if (identityToken) {
    //     const appleCredential = firebase.auth.AppleAuthProvider.credential(
    //       identityToken,
    //       nonce,
    //     );
    //     const userCredential = await firebase
    //       .auth()
    //       .signInWithCredential(appleCredential);
    //     const user = this.fromApple(userCredential);
    //     let profile = await profilesApi.getById(user.id);
    //     if (profile) {
    //       logger.debug('profile found', profile.id);
    //     } else {
    //       profile = {
    //         email: user.email,
    //         id: user.id,
    //       } as Profile;
    //       !!fullName?.givenName && (profile.firstName = fullName?.givenName);
    //       !!fullName?.familyName && (profile.lastName = fullName?.familyName);
    //       profilesApi.set(user.id, profile);
    //     }
    //     Analytics.logLogin('APPLE');
    //     return {user, profile};
    //   } else {
    //     // handle this - retry?
    //   }
    // } catch (error) {
    //   console.error(error);
    //   throw error;
    // }
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
