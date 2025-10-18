import { Profile } from "@/models/Profile.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { DatabaseApi } from "./DatabaseApi";

class ProfilesApi extends DatabaseApi<Profile> {
  constructor() {
    super("profiles");
  }

  saveToStorage = (profile: Profile) => {
    return AsyncStorage.setItem("profile", JSON.stringify(profile));
  };

  getFromStorage = async () => {
    const profileJson = await AsyncStorage.getItem("profile");
    if (profileJson) {
      return JSON.parse(profileJson) as Profile;
    }
  };

  isFirstLoad = async () => {
    const isFirstLoadString = await AsyncStorage.getItem("isFirstLoad");
    if (isFirstLoadString) {
      return isFirstLoadString === "true";
    }
    return true;
  };
  setFirstLoad = (isFirstLoad: boolean) => {
    return AsyncStorage.setItem("isFirstLoad", isFirstLoad ? "true" : "false");
  };

  removeFromStorage = async () => {
    await AsyncStorage.removeItem("profile");
    await AsyncStorage.removeItem("location");
  };

  updateToken = async (profile: Profile, token: string) => {
    try {
      const newProfile = { ...profile, token };
      await this.update(profile.id, { token });
      await this.saveToStorage(newProfile);
      return newProfile;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  addTargetCategory = (userId: string, categoryId: string) => {
    return this.update(userId, {
      targetCategories: firestore.FieldValue.arrayUnion(categoryId),
    });
  };

  getName = (profile: Profile) => {
    return profile?.firstName
      ? profile?.firstName + " " + profile?.lastName
      : profile?.email ?? "Guest";
  };
}

const profilesApi = new ProfilesApi();

export default profilesApi;
