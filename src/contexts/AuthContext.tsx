// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  FirebaseAuthTypes,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { auth } from "@/firebase"; // Adjust path if needed
import { ActivityIndicator, View } from "react-native"; // For loading state
import { Profile } from "@/models/Profile.model";
import { fromFirebaseUser, User } from "@/contexts/user-model";
import profilesApi from "@/api/profileApi";
import authApi from "@/api/authApi";
import { ICredentials } from "./AuthReducer";

type FBUser = FirebaseAuthTypes.User | null;
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isFirstLoad?: boolean;
  isAuthenticated: boolean;

  // Set Functions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  // Sign In Function
  signIn: (credentials: ICredentials) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    newProfile: Profile
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: () => {},
  setProfile: () => {},
  signIn: () => {
    return Promise.resolve();
  },
  signUp: () => {
    return Promise.resolve();
  },
  signOut: () => {
    return Promise.resolve();
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [appUser, setAppUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to user state changes
    console.log("Subscribing to auth state changes...");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        console.log("Auth state changed:", currentUser);
        if (!currentUser) {
          setAppUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }
        const appUser = fromFirebaseUser(currentUser);
        setAppUser(appUser);
        // setProfile(profile);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSetUser = (user: User | null) => {
    setAppUser(user);
  };

  const handleSetProfile = (profile: Profile | null) => {
    setProfile(profile);
  };

  const handleSignIn = async (credentials: ICredentials) => {
    setIsLoading(true);
    try {
      const user = await authApi.signIn({
        username: credentials.username,
        password: credentials.password,
      });
      if (!user) {
        throw new Error("User not found");
      }
      setAppUser(user);
      // Navigation is handled by the AuthProvider and root _layout
      // router.replace('/(app)/home'); // No need to manually navigate here
    } catch (err: any) {
      throw err; // Rethrow the error to be handled by the calling component
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    newProfile: Profile
  ) => {
    setIsLoading(true);
    try {
      const session = await authApi.signUp(
        { username: email, password },
        newProfile
      );
      console.log("User signed up!", session);
      if (session) {
        const { user, profile } = session;
        setAppUser(user);
        setProfile(profile);
      }
    } catch (err: any) {
      console.error("Error signing up:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await auth.signOut();
      console.log("User signed out!");
    } catch (err: any) {
      console.error("Error signing out:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Update the context value to include the setter functions
  return (
    <AuthContext.Provider
      value={{
        user: appUser,
        isLoading,
        isAuthenticated: !!appUser,
        profile,
        setUser: handleSetUser,
        setProfile: handleSetProfile,
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
