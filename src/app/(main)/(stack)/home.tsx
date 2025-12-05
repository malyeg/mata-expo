import { Redirect } from "expo-router";

/**
 * Home route for Universal Links
 * Redirects https://www.mataup.com/home to the main dashboard
 */
export default function HomeRedirect() {
  return <Redirect href="/(main)/(stack)/(tabs)" />;
}

