import { db } from "@/firebase";
import {
  doc,
  FirebaseFirestoreTypes,
  FirestoreError,
  getFirestore,
  onSnapshot,
  Unsubscribe,
} from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from "react";

// Types for the hook parameters
interface UseDocumentSnapshotParams {
  collectionName: string;
  id: string;
  query?: (
    ref: FirebaseFirestoreTypes.DocumentReference
  ) => FirebaseFirestoreTypes.DocumentReference;
}

// Return type for the hook
interface UseDocumentSnapshotResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  exists: boolean;
  metadata: FirebaseFirestoreTypes.SnapshotMetadata | null;
  refresh: () => void;
}

/**
 * Custom hook for real-time Firestore document updates using modular API v22+
 * @param params - Object containing collectionName, id, and optional query
 * @returns Object with data, loading state, error, and helper properties
 */
export function useDocumentSnapshot<T = any>({
  collectionName,
  id,
  query,
}: UseDocumentSnapshotParams): UseDocumentSnapshotResult<T> {
  console.log("useDocumentSnapshot called", {
    collectionName,
    id,
    query,
  });
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [exists, setExists] = useState<boolean>(false);
  const [metadata, setMetadata] =
    useState<FirebaseFirestoreTypes.SnapshotMetadata | null>(null);

  // Use ref to store the unsubscribe function
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Refresh function to manually trigger a re-subscription
  const refresh = () => {
    setLoading(true);
    setError(null);
    // The useEffect will handle re-subscription due to state change
  };

  useEffect(() => {
    // Validate required parameters
    if (!collectionName || !id) {
      const validationError = new Error("collectionName and id are required");
      setError(validationError);
      setLoading(false);
      return;
    }

    // Reset states when parameters change
    setLoading(true);
    setError(null);
    setData(null);
    setExists(false);
    setMetadata(null);

    try {
      // Create document reference using React Native Firebase syntax
      let docRef = db.collection(collectionName).doc(id);

      // Apply query if provided (though less common for single documents)
      if (query && typeof query === "function") {
        docRef = query(docRef);
      }

      // Set up the snapshot listener
      const unsubscribe = docRef.onSnapshot(
        {
          // Optional: Include metadata changes
          includeMetadataChanges: true,
        },
        (documentSnapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
          try {
            setExists(documentSnapshot.exists);
            setMetadata(documentSnapshot.metadata);

            if (documentSnapshot.exists()) {
              // Document exists, extract data
              const docData = documentSnapshot.data() as T;
              setData({
                ...docData,
                id: documentSnapshot.id, // Include document ID
              } as T);
            } else {
              // Document doesn't exist
              setData(null);
            }

            setError(null);
          } catch (err) {
            console.error("Error processing document snapshot:", err);
            setError(
              err instanceof Error ? err : new Error("Unknown processing error")
            );
          } finally {
            setLoading(false);
          }
        },
        (err: Error) => {
          console.error("Firestore onSnapshot error:", err);
          setError(err);
          setLoading(false);
          setData(null);
          setExists(false);
          setMetadata(null);
        }
      );

      // Store unsubscribe function
      unsubscribeRef.current = unsubscribe;

      // Return cleanup function
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error setting up document snapshot listener:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to setup listener")
      );
      setLoading(false);
    }
  }, [collectionName, id, query]); // Dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    exists,
    metadata,
    refresh,
  };
}

// Example usage types and interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  likes: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

// Utility hook with custom data transformation
export function useDocumentSnapshotWithTransform<T, R = T>({
  collectionName,
  id,
  transform,
}: UseDocumentSnapshotParams & {
  transform?: (data: T & { id: string }) => R;
}): UseDocumentSnapshotResult<R> {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [exists, setExists] = useState<boolean>(false);
  const [metadata, setMetadata] =
    useState<FirebaseFirestoreTypes.SnapshotMetadata | null>(null);

  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const refresh = () => {
    setLoading(true);
    setError(null);
  };

  useEffect(() => {
    if (!collectionName || !id) {
      const validationError = new Error(
        "collectionName and id are required"
      ) as FirestoreError;
      validationError.code = "invalid-argument";
      setError(validationError);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setExists(false);
    setMetadata(null);

    try {
      const db = getFirestore();
      const docRef = doc(db, collectionName, id);

      const unsubscribe = onSnapshot(
        docRef,
        { includeMetadataChanges: true },
        (documentSnapshot) => {
          try {
            setExists(documentSnapshot.exists());
            setMetadata(documentSnapshot.metadata);

            if (documentSnapshot.exists()) {
              const rawData = {
                ...documentSnapshot.data(),
                id: documentSnapshot.id,
              } as T & { id: string };

              // Apply transformation if provided
              const transformedData = transform
                ? transform(rawData)
                : (rawData as unknown as R);
              setData(transformedData);
            } else {
              setData(null);
            }

            setError(null);
          } catch (err) {
            setError(err as FirestoreError);
          } finally {
            setLoading(false);
          }
        },
        (err: FirestoreError) => {
          setError(err);
          setLoading(false);
          setData(null);
          setExists(false);
          setMetadata(null);
        }
      );

      unsubscribeRef.current = unsubscribe;

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    } catch (err) {
      setError(err as FirestoreError);
      setLoading(false);
    }
  }, [collectionName, id, transform]);

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    exists,
    metadata,
    refresh,
  };
}

/*
// Usage examples with modular API:

// Basic usage
const { data: user, loading, error, exists } = useDocumentSnapshot<User>({
  collectionName: 'users',
  id: 'user123'
});

// Usage with data transformation
interface RawUser {
  name: string;
  email: string;
  created_at: FirebaseFirestoreTypes.Timestamp;
  updated_at: FirebaseFirestoreTypes.Timestamp;
}

interface TransformedUser {
  id: string;
  fullName: string;
  emailAddress: string;
  createdDate: Date;
  updatedDate: Date;
}

const userTransform = (rawData: RawUser & { id: string }): TransformedUser => ({
  id: rawData.id,
  fullName: rawData.name.toUpperCase(),
  emailAddress: rawData.email.toLowerCase(),
  createdDate: rawData.created_at?.toDate() || new Date(),
  updatedDate: rawData.updated_at?.toDate() || new Date()
});

const { data: user, loading, error } = useDocumentSnapshotWithTransform<RawUser, TransformedUser>({
  collectionName: 'users',
  id: userId,
  transform: userTransform
});

// In a React component
export default function UserProfile({ userId }: { userId: string }) {
  const { 
    data: user, 
    loading, 
    error, 
    exists, 
    metadata,
    refresh 
  } = useDocumentSnapshot<User>({
    collectionName: 'users',
    id: userId
  });

  if (loading) {
    return <Text>Loading user...</Text>;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={refresh} />
      </View>
    );
  }

  if (!exists) {
    return <Text>User not found</Text>;
  }

  return (
    <View>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>From cache: {metadata?.fromCache ? 'Yes' : 'No'}</Text>
      <Text>Has pending writes: {metadata?.hasPendingWrites ? 'Yes' : 'No'}</Text>
      <Button title="Refresh" onPress={refresh} />
    </View>
  );
}
*/
