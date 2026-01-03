import { Profile } from "@/models/Profile.model";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import {
  AppleAuthProvider,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  FacebookAuthProvider,
  FirebaseAuthTypes,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
} from "@react-native-firebase/auth";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
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
    return onAuthStateChanged(auth, listnerCallback);
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

  facebookSignIn = async () => {
    try {
      // Request login permissions
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        throw {
          code: "auth/facebook/loginCanceled",
          message: "Login was cancelled",
        };
      }

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error("Something went wrong obtaining access token");
      }

      // Create Firebase credential
      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken
      );

      // Sign in with Firebase
      const userCredential = await signInWithCredential(
        auth,
        facebookCredential
      );
      const userRules = await this.getUserRules();
      const { user, profile } = this.fromFaceBook(userCredential, userRules);

      // Check if profile exists, create if new user
      let existingProfile = await profilesApi.getById(user.id);
      if (!existingProfile) {
        await profilesApi.set(user.id, profile);
        existingProfile = profile;
      }

      Analytics.logLogin("FACEBOOK");
      return { user, profile: existingProfile };
    } catch (error) {
      const err = (error as any).code ?? (error as any).message;
      Analytics.logEvent("login_error", { error: err });
      throw error;
    }
  };

  appleSignIn = async () => {
    try {
      // Perform the Apple auth request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, nonce, fullName } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned");
      }

      // Create Firebase credential using modular API
      const appleCredential = AppleAuthProvider.credential(
        identityToken,
        nonce!
      );

      // Sign in with credential using modular API
      const userCredential = await signInWithCredential(auth, appleCredential);
      const user = this.fromApple(userCredential);

      // Check if profile exists, create if new user
      let profile = await profilesApi.getById(user.id);
      if (!profile) {
        profile = {
          email: user.email,
          id: user.id,
        } as Profile;
        if (fullName?.givenName) {
          profile.firstName = fullName.givenName;
        }
        if (fullName?.familyName) {
          profile.lastName = fullName.familyName;
        }
        await profilesApi.set(user.id, profile);
      }

      Analytics.logLogin("APPLE");
      return { user, profile };
    } catch (error) {
      const err = (error as any).code ?? (error as any).message;
      Analytics.logEvent("login_error", { error: err });
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
