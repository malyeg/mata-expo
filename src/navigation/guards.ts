import { useAuthStore } from "../store/auth-store";

export const authGuards = {
  // Check if user has a session (either authenticated user or guest)
  hasValidSession: () => {
    const { user } = useAuthStore.getState();
    return user !== null && user !== undefined;
  },

  // Check if user is fully authenticated (not guest)
  isAuthenticated: () => {
    const { isAuthenticated } = useAuthStore.getState();
    return isAuthenticated === true;
  },

  // Combined guards for common scenarios
  canAccessApp: () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    // Don't allow access during initialization
    if (!user) {
      return false;
    }

    // Allow access if user is authenticated OR if user is a guest
    return isAuthenticated === true;
  },

  canAccessAuth: () => {
    const { isAuthenticated } = useAuthStore.getState();

    // During initialization, allow access to auth screens as fallback
    if (!isAuthenticated) {
      return true;
    }

    // Only allow access to auth screens if user is NOT authenticated
    // This prevents logged-in users from accessing login/signup screens
    return !authGuards.isAuthenticated();
  },
};
