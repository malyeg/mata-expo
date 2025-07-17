// app/_layout.tsx
import { AuthProvider, useAuth } from "@/contexts/AuthContext"; // Adjust path
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log("InitialLayout useEffect triggered");
    if (isLoading) return; // Don't redirect until auth state is confirmed

    const inAuthGroup = segments[0] === "(auth)";

    console.log(
      `User: ${user?.id}, isLoading: ${isLoading}, inAuthGroup: ${inAuthGroup}`
    );

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if the user is not authenticated
      // and is not already in the (auth) group.
      console.log("Redirecting to sign-in");
      router.replace("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      // Redirect away from the auth pages if the user is authenticated
      // and is currently in the (auth) group.
      console.log("Redirecting to home");
      router.replace("/(main)/home"); // Or your main authenticated route
    } else {
      // User is authenticated and in the main app group, do nothing
      console.log("User is authenticated and in the main app group");
    }
  }, [user, isLoading, segments, router]); // Add dependencies

  // Slot renders the current child route (either from (app) or (auth))
  return <Slot />;
};

// Main Root Layout component
const RootLayout = () => {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
};

export default RootLayout;
