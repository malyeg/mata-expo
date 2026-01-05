import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

// Navigation integration for tracking route changes
export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
  ignoreEmptyBackNavigationTransactions: true,
});

const version = Constants.expoConfig?.version || "1.0.0";
const buildNumber =
  Constants.expoConfig?.ios?.buildNumber ||
  Constants.expoConfig?.android?.versionCode ||
  "1";

export function initSentry() {
  Sentry.init({
    // === Core ===
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enabled: true,
    debug: false,

    // === Release Tracking ===
    environment: __DEV__ ? "development" : "production",
    release: `mata-app@${version}`,
    dist: String(buildNumber),

    // === Error Tracking ===
    sendDefaultPii: true,
    attachScreenshot: true,
    attachViewHierarchy: true,
    enableCaptureFailedRequests: true,

    // === Performance Monitoring ===
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    enableAutoPerformanceTracing: true,

    // === Session Replay ===
    replaysSessionSampleRate: __DEV__ ? 1.0 : 0.1,
    replaysOnErrorSampleRate: 1.0,

    // === Logs ===
    enableLogs: true,

    // === Integrations ===
    integrations: [navigationIntegration, Sentry.mobileReplayIntegration()],
  });
}

/**
 * Set the user context for Sentry events.
 * Call this after successful login.
 */
export function setSentryUser(user: {
  id: string;
  email?: string | null;
  username?: string | null;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email ?? undefined,
    username: user.username ?? undefined,
  });
}

/**
 * Clear the user context.
 * Call this on logout.
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

export { Sentry };
