export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  emailVerified?: boolean;
  type?: "anonymous" | "user" | "facebook" | "apple";
  isAnonymous?: boolean;
  metadata?: {
    creationTime?: number;
    lastSignInTime: number;
  };
  rules?: string[];
  isAdmin?: boolean;
  isTester?: boolean;
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
  displayName?: string | null;
  photoURL?: string;
  phoneNumber?: string;
}

export const fromFirebaseUser = (fbUser: any, rules?: string[]) => {
  const user: User = {
    id: fbUser.uid,
    username: fbUser.email,
    email: fbUser.email,
    emailVerified: fbUser.emailVerified,
    type: fbUser.providerId,
    isAnonymous: fbUser.isAnonymous,
    metadata: fbUser.metadata,
  };

  if (rules && rules.length > 0) {
    user.rules = [...rules];
    if (rules.includes("admin")) {
      user.isAdmin = true;
    }
  }
  return user;
};
