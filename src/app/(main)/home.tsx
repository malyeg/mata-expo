import profilesApi from "@/api/profileApi";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/models/Profile.model";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
const Home = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        console.log("Home screen mounted");
        const freshProfile = await profilesApi.getById(user.id);
        console.log("Document data:", profile);
        setProfile(freshProfile);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>{profile?.email}</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
