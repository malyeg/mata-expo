import {
  collection,
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useRef, useState } from "react";

/**
 * Recursively converts Firebase Timestamp objects to JavaScript Date objects
 */
const convertTimestampsToDate = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  // Check if it's a Firebase Timestamp
  if (data instanceof Object && typeof data.toDate === "function") {
    return data.toDate();
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => convertTimestampsToDate(item));
  }

  // Handle objects
  if (typeof data === "object") {
    const converted: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        converted[key] = convertTimestampsToDate(data[key]);
      }
    }
    return converted;
  }

  // Return primitive values as-is
  return data;
};

// Types for the hook
interface UseFirestoreQueryOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  onSuccess?: (data: any[]) => void;
  onError?: (error: Error) => void;
}

interface UseFirestoreQueryResult<T = any> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Generic function type for query builders
type QueryBuilder = (
  collection: FirebaseFirestoreTypes.CollectionReference
) => FirebaseFirestoreTypes.Query;

/**
 * Custom hook for fetching Firestore data with real-time updates
 *
 * @param collectionPath - The path to the Firestore collection
 * @param queryBuilder - Optional function to build complex queries
 * @param options - Configuration options for the hook
 * @returns Object containing data, loading state, error, and refetch function
 */
export const useFirestoreQuery = <T = any>(
  collectionPath: string,
  queryBuilder?: QueryBuilder,
  options: UseFirestoreQueryOptions = {}
): UseFirestoreQueryResult<T> => {
  const { enabled = true, refetchOnMount = true, onSuccess, onError } = options;

  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track if component is mounted
  const isMounted = useRef(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Create a simple refetch function that doesn't use useCallback
  const refetch = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!enabled || !isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionPath) as FirebaseFirestoreTypes.CollectionReference;
      const query = queryBuilder ? queryBuilder(collectionRef) : collectionRef;

      const unsubscribe = query.onSnapshot(
        (snapshot) => {
          if (!isMounted.current) return;

          const documents = snapshot.docs.map((doc) => {
            const docData = doc.data();
            const convertedData = convertTimestampsToDate(docData);
            return {
              id: doc.id,
              ...convertedData,
            };
          }) as T[];

          setData(documents);
          setLoading(false);
          onSuccess?.(documents);
        },
        (err) => {
          if (!isMounted.current) return;

          console.error("Firestore query error:", err);
          setError(err as Error);
          setLoading(false);
          onError?.(err as Error);
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      if (!isMounted.current) return;

      const error = err as Error;
      setError(error);
      setLoading(false);
      onError?.(error);
    }
  };

  // Single effect that handles everything
  useEffect(() => {
    isMounted.current = true;

    // Only setup listener if enabled and refetchOnMount
    if (enabled && refetchOnMount) {
      refetch();
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // EMPTY DEPENDENCY ARRAY - only runs on mount/unmount

  // Separate effect for when key dependencies change
  useEffect(() => {
    if (!enabled) {
      // Clean up if disabled
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    // Restart the query when these change
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionPath, enabled]); // Only collectionPath and enabled

  // Note: queryBuilder changes are handled by refetch() being called
  // We don't include queryBuilder in dependencies to avoid loops

  return {
    data,
    loading,
    error,
    refetch,
  };
};
