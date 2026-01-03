import { db } from "@/firebase";
import {
  collection,
  FirebaseFirestoreTypes,
  onSnapshot,
} from "@react-native-firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

// Types for the hook parameters
interface UseCollectionSnapshotParams {
  collectionName: string;
  query?: (
    ref: FirebaseFirestoreTypes.CollectionReference
  ) => FirebaseFirestoreTypes.Query;
  enabled?: boolean; // Optional flag to enable/disable the listener
}

// Return type for the hook
interface UseCollectionSnapshotResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  isEmpty: boolean;
  size: number;
  metadata: FirebaseFirestoreTypes.SnapshotMetadata | null;
  refresh: () => void;
  // Additional helpers for document changes
  docChanges: FirebaseFirestoreTypes.DocumentChange<T>[];
  hasPendingWrites: boolean;
  fromCache: boolean;
}

export function useCollectionSnapshot<T, R = T>({
  collectionName,
  query,
  transform,
  enabled = true,
}: UseCollectionSnapshotParams & {
  transform?: (data: T & { id: string }) => R;
}): UseCollectionSnapshotResult<R> {
  const [data, setData] = useState<R[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [size, setSize] = useState<number>(0);
  const [metadata, setMetadata] =
    useState<FirebaseFirestoreTypes.SnapshotMetadata | null>(null);
  const [docChanges, setDocChanges] = useState<
    FirebaseFirestoreTypes.DocumentChange<R>[]
  >([]);
  const [hasPendingWrites, setHasPendingWrites] = useState<boolean>(false);
  const [fromCache, setFromCache] = useState<boolean>(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Store the query and transform functions in refs to avoid dependency issues
  const queryRef = useRef(query);
  const transformRef = useRef(transform);

  // Update refs when functions change
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (!collectionName) {
      const validationError = new Error("collectionName is required");
      setError(validationError);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setData([]);
    setIsEmpty(true);
    setSize(0);
    setMetadata(null);
    setDocChanges([]);
    setHasPendingWrites(false);
    setFromCache(false);

    try {
      // Use modular collection()
      let collectionRef: any = collection(db, collectionName);

      if (queryRef.current && typeof queryRef.current === "function") {
        // Pass the modular collection ref to the query builder
        // The query builder should return a modular Query object (or namespaced one, both likely work with onSnapshot but let's be safe)
        collectionRef = queryRef.current(collectionRef);
      }

      // Use modular onSnapshot()
      const unsubscribe = onSnapshot(
        collectionRef,
        { includeMetadataChanges: true },
        (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
          try {
            setMetadata(querySnapshot.metadata);
            setFromCache(querySnapshot.metadata.fromCache);
            setHasPendingWrites(querySnapshot.metadata.hasPendingWrites);
            setIsEmpty(querySnapshot.empty);
            setSize(querySnapshot.size);

            // Transform document changes if needed
            const changes = querySnapshot.docChanges();
            if (transformRef.current) {
              const transformedChanges = changes.map((change) => ({
                ...change,
                doc: {
                  ...change.doc,
                  data: () =>
                    transformRef.current!({
                      ...change.doc.data(),
                      id: change.doc.id,
                    } as T & { id: string }),
                },
              })) as FirebaseFirestoreTypes.DocumentChange<R>[];
              setDocChanges(transformedChanges);
            } else {
              setDocChanges(
                changes as FirebaseFirestoreTypes.DocumentChange<R>[]
              );
            }

            // Transform documents data
            const documents: R[] = [];
            querySnapshot.forEach((doc) => {
              const rawData = {
                ...doc.data(),
                id: doc.id,
              } as T & { id: string };

              const transformedData = transformRef.current
                ? transformRef.current(rawData)
                : (rawData as unknown as R);
              documents.push(transformedData);
            });

            setData(documents);
            setError(null);
          } catch (err) {
            setError(
              err instanceof Error ? err : new Error("Processing error")
            );
          } finally {
            setLoading(false);
          }
        },
        (err: Error) => {
          setError(err);
          setLoading(false);
          setData([]);
          setIsEmpty(true);
          setSize(0);
          setMetadata(null);
          setDocChanges([]);
          setHasPendingWrites(false);
          setFromCache(false);
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
      setError(err instanceof Error ? err : new Error("Setup error"));
      setLoading(false);
    }
  }, [collectionName, enabled]); // Removed query and transform from dependencies

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
    isEmpty,
    size,
    metadata,
    refresh,
    docChanges,
    hasPendingWrites,
    fromCache,
  };
}

// Alternative version without transform for simpler usage
export function useCollectionSnapshotSimple<T = any>({
  collectionName,
  query,
  enabled = true,
}: UseCollectionSnapshotParams): UseCollectionSnapshotResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [size, setSize] = useState<number>(0);
  const [metadata, setMetadata] =
    useState<FirebaseFirestoreTypes.SnapshotMetadata | null>(null);
  const [docChanges, setDocChanges] = useState<
    FirebaseFirestoreTypes.DocumentChange<T>[]
  >([]);
  const [hasPendingWrites, setHasPendingWrites] = useState<boolean>(false);
  const [fromCache, setFromCache] = useState<boolean>(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (!collectionName) {
      const validationError = new Error("collectionName is required");
      setError(validationError);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setData([]);
    setIsEmpty(true);
    setSize(0);
    setMetadata(null);
    setDocChanges([]);
    setHasPendingWrites(false);
    setFromCache(false);

    try {
      let collectionRef: FirebaseFirestoreTypes.Query =
        db.collection(collectionName);

      if (queryRef.current && typeof queryRef.current === "function") {
        collectionRef = queryRef.current(db.collection(collectionName));
      }

      const unsubscribe = collectionRef.onSnapshot(
        { includeMetadataChanges: true },
        (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
          try {
            setMetadata(querySnapshot.metadata);
            setFromCache(querySnapshot.metadata.fromCache);
            setHasPendingWrites(querySnapshot.metadata.hasPendingWrites);
            setIsEmpty(querySnapshot.empty);
            setSize(querySnapshot.size);

            const changes = querySnapshot.docChanges();
            setDocChanges(
              changes as FirebaseFirestoreTypes.DocumentChange<T>[]
            );

            // Extract documents data without transformation
            const documents: T[] = [];
            querySnapshot.forEach((doc) => {
              const docData = {
                ...doc.data(),
                id: doc.id,
              } as T;
              documents.push(docData);
            });

            setData(documents);
            setError(null);
          } catch (err) {
            setError(
              err instanceof Error ? err : new Error("Processing error")
            );
          } finally {
            setLoading(false);
          }
        },
        (err: Error) => {
          setError(err);
          setLoading(false);
          setData([]);
          setIsEmpty(true);
          setSize(0);
          setMetadata(null);
          setDocChanges([]);
          setHasPendingWrites(false);
          setFromCache(false);
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
      setError(err instanceof Error ? err : new Error("Setup error"));
      setLoading(false);
    }
  }, [collectionName, enabled]); // Only collectionName and enabled as dependencies

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
    isEmpty,
    size,
    metadata,
    refresh,
    docChanges,
    hasPendingWrites,
    fromCache,
  };
}

/*
// RECOMMENDED USAGE TO AVOID LOOPS:

// ✅ Define query outside component or use useCallback
const getUsersQuery = (ref: FirebaseFirestoreTypes.CollectionReference) => 
  ref.where('active', '==', true).orderBy('name', 'asc');

// ✅ Define transform outside component or use useCallback  
const userTransform = (rawData: User & { id: string }): User => ({
  ...rawData,
  name: rawData.name.toUpperCase()
});

export default function UsersList() {
  // ✅ This won't cause loops because query function is stable
  const { data: users, loading, error } = useCollectionSnapshotSimple<User>({
    collectionName: 'users',
    query: getUsersQuery
  });

  // ✅ Alternative: Use useCallback to stabilize the function
  const dynamicQuery = useCallback((ref: FirebaseFirestoreTypes.CollectionReference) => {
    return ref.where('status', '==', 'active').limit(10);
  }, []); // Empty dependency array makes it stable

  const { data: activeUsers } = useCollectionSnapshotSimple<User>({
    collectionName: 'users',
    query: dynamicQuery
  });

  // ✅ With transform using useCallback
  const stableTransform = useCallback((data: RawUser & { id: string }) => ({
    id: data.id,
    fullName: data.name.toUpperCase(),
    email: data.email.toLowerCase()
  }), []);

  const { data: transformedUsers } = useCollectionSnapshot<RawUser, TransformedUser>({
    collectionName: 'users',
    transform: stableTransform
  });

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text>{item.name}</Text>
          )}
        />
      )}
    </View>
  );
}

// ❌ DON'T DO THIS (will cause infinite loops):
export function BadExample() {
  const { data } = useCollectionSnapshot<User>({
    collectionName: 'users',
    // ❌ This creates a new function on every render
    query: (ref) => ref.where('active', '==', true),
    // ❌ This creates a new function on every render
    transform: (data) => ({ ...data, name: data.name.toUpperCase() })
  });
  
  return <View>...</View>;
}

// ✅ DO THIS INSTEAD:
export function GoodExample() {
  // ✅ Stable query function
  const queryFn = useCallback((ref: FirebaseFirestoreTypes.CollectionReference) => 
    ref.where('active', '==', true), []);
  
  // ✅ Stable transform function
  const transformFn = useCallback((data: User & { id: string }) => 
    ({ ...data, name: data.name.toUpperCase() }), []);
  
  const { data } = useCollectionSnapshot<User>({
    collectionName: 'users',
    query: queryFn,
    transform: transformFn
  });
  
  return <View>...</View>;
}
*/
