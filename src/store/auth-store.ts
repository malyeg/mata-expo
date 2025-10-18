// src/stores/authStore.ts
import authApi from "@/api/authApi";
import profilesApi from "@/api/profileApi";
import { fromFirebaseUser, User } from "@/contexts/user-model";
import { auth } from "@/firebase";
import { Profile } from "@/models/Profile.model";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ICredentials } from "../contexts/AuthReducer";
interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isFirstLoad: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  authListener: (() => void) | null;
}

interface AuthActions {
  // Set Functions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;

  // Auth Functions
  signIn: (credentials: ICredentials) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    newProfile: Profile
  ) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  // Auto-initialization for Expo Router
  _initializeOnFirstAccess: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    user: null,
    profile: null,
    isLoading: true,
    isFirstLoad: true,
    isAuthenticated: false,
    isInitialized: false,
    authListener: null,

    // Setter functions
    setUser: (user: User | null) => {
      set({
        user,
        isAuthenticated: !!user,
      });
    },

    setProfile: (profile: Profile | null) => {
      set({ profile });
    },

    setLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    // Auth functions
    signIn: async (credentials: ICredentials) => {
      set({ isLoading: true });
      try {
        const user = await authApi.signIn({
          username: credentials.username,
          password: credentials.password,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const profile = await profilesApi.getById(user.id);

        set({
          user,
          profile,
          isAuthenticated: true,
        });
      } catch (err: any) {
        throw err; // Rethrow the error to be handled by the calling component
      } finally {
        set({ isLoading: false });
      }
    },

    signUp: async (email: string, password: string, newProfile: Profile) => {
      set({ isLoading: true });
      try {
        const session = await authApi.signUp(
          { username: email, password },
          newProfile
        );

        if (session) {
          const { user, profile } = session;
          set({
            user,
            profile,
            isAuthenticated: true,
          });
        }
      } catch (err: any) {
        console.error("Error signing up:", err);
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        await auth.signOut();
        console.log("User signed out!");
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
        });
      } catch (err: any) {
        console.error("Error signing out:", err);
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteAccount: async () => {
      try {
        const user = auth.currentUser;
        await user?.delete();
        await auth.signOut();
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
        });
      } finally {
        set({ isLoading: false });
        // RNRestart.Restart();
      }
    },
    // Auto-initialization for Expo Router (called on first access)
    _initializeOnFirstAccess: () => {
      const { isInitialized } = get();

      // Prevent multiple initializations
      if (isInitialized) {
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        try {
          if (!currentUser) {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false,
              isFirstLoad: false,
              isInitialized: true,
            });
            return;
          }

          const appUser = fromFirebaseUser(currentUser);
          let profile = get().profile;
          if (!get().profile) {
            profile = await profilesApi.getById(appUser.id);
          }
          set({
            user: appUser,
            profile: profile,
            isAuthenticated: true,
            isLoading: false,
            isFirstLoad: false,
            isInitialized: true,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          set({
            isLoading: false,
            isFirstLoad: false,
            isInitialized: true,
          });
        }
      });

      // Store the unsubscribe function and mark as initialized
      set({
        authListener: unsubscribe,
        isInitialized: true,
      });
    },
  }))
);

// Selectors for specific state pieces (optional but recommended)
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthProfile = () => useAuthStore((state) => state.profile);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useIsAuthInitialized = () =>
  useAuthStore((state) => state.isInitialized);
