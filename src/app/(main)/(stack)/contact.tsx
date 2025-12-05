import { Redirect } from "expo-router";

/**
 * Contact route for Universal Links
 * Redirects https://www.mataup.com/contact to the contact page
 */
export default function ContactRedirect() {
  return <Redirect href="/(main)/contact" />;
}

