import { LogBox } from "react-native";

declare global {
  var RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS: boolean | undefined;
}

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Suppress iOS simulator haptic warnings
LogBox.ignoreLogs([
  "CoreHaptics",
  "CHHapticPattern",
  "_UIKBFeedbackGenerator",
  "hapticpatternlibrary.plist",
  "Error creating CHHapticPattern",
]);

export const getWarningsOff = () => {
  return globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS;
};
