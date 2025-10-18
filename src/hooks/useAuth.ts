import authApi from "@/api/authApi";
import profilesApi from "@/api/profileApi";
import { Profile } from "@/models/Profile.model";
import { useAuthStore } from "@/store/auth-store";
import { ICredentials } from "../contexts/AuthReducer";

const useAuth = () => {
  const session = useAuthStore();

  const sendPasswordResetEmail = async (email: string) => {
    await authApi.sendPasswordResetEmail(email);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const credentials: ICredentials = {
      username: session.user?.username!,
      password: oldPassword,
    };
    await authApi.changePassword(credentials, newPassword);
  };
  const updateProfile = async (newProfile: Profile) => {
    await profilesApi.update(newProfile.id, newProfile);
    // TODO move to profilesapi
    await profilesApi.saveToStorage(newProfile);
  };

  const addTargetCategory = async (categoryId: string) => {
    const categoryExists =
      session?.profile?.targetCategories?.includes(categoryId);
    if (session?.profile && !categoryExists) {
      await profilesApi.addTargetCategory(session?.profile?.id!, categoryId);
      const targetCategories = session?.profile.targetCategories ?? [];
      targetCategories.push(categoryId);
      const newProfile: Profile = { ...session?.profile, targetCategories };
      profilesApi.saveToStorage(newProfile);
      session?.setProfile(newProfile);
      console.log("addTargetCategory", newProfile.targetCategories);
    } else {
      console.log("category already exits");
    }
  };

  const loadProfile = async () => {
    const freshProfile = await profilesApi.getById(session.user?.id!);
    if (freshProfile) {
      session.setProfile(freshProfile);
    }
    return freshProfile;
  };

  const getName = () => {
    return profilesApi.getName(session?.profile!);
  };

  return {
    user: session?.user!,
    sharedUser: {
      id: session?.user?.id!,
      name: getName()!,
      email: session?.user?.username!,
      displayName: getName()!,
    },
    isFirstLoad: session?.isFirstLoad,
    profile: session.profile!,
    signUp: session.signUp,
    signIn: session.signIn,
    signOut: session.signOut,
    sendPasswordResetEmail,
    updateProfile,
    changePassword,
    loadProfile,
    deleteAccount: session.deleteAccount,
    addTargetCategory,
    getName,
    // fbSignIn: session.fbSignIn,
    // appleSignIn: session.appleSignIn,
    // guestSignIn: session.guestSignIn,
  };
};

export default useAuth;
