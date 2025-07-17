// app/(app)/_layout.tsx
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router"; // Or Tabs
import { Button } from "react-native";
import { signOut } from "@react-native-firebase/auth";
import { auth } from "@/firebase"; // Adjust path
import { useAuth } from "@/contexts/AuthContext"; // Adjust path

const AppLayout = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("AppLayout mounted");
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // AuthProvider listener will handle redirect via root _layout.tsx
      console.log("User signed out");
      // Optionally explicitly redirect if needed, but context should handle it
      // router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // If user is somehow null here (shouldn't happen due to root layout protection)
  // you could add another layer of check/redirect, but it's usually redundant.

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Home",
          headerRight: () => <Button onPress={handleLogout} title="Logout" />,
        }}
      />
      {/* Add other authenticated screens here */}
      {/* <Stack.Screen name="profile" options={{ title: 'Profile' }} /> */}
    </Stack>
    // Or use Tabs:
    // <Tabs>
    //   <Tabs.Screen name="home" options={{ title: 'Home' }}/>
    //   <Tabs.Screen name="profile" options={{ title: 'Profile' }}/>
    // </Tabs>
  );
};

export default AppLayout;
