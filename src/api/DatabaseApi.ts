// src/api/DatabaseApi.ts
import constants from "@/config/constants";
import {
  DataCollection,
  Operation,
  Query,
  Filter as QueryFilter,
} from "@/types/DataTypes";
import { QuerySnapshot } from "@/types/UtilityTypes";
import Analytics, { ActionType, AnalyticsEvent } from "@/utils/Analytics";
import type {
  FirebaseFirestoreTypes,
  UpdateData,
} from "@react-native-firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";
import { crashlytics, db } from "../firebase";
import { Api, APIOptions } from "./Api";

export type WithId<T> = T & { id: string };

/**
 * Remove undefined values from an object recursively
 */
function removeUndefinedValues<T extends object>(obj: T): Partial<T> {
  const cleaned: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (value === undefined) {
        continue;
      }

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        cleaned[key] = removeUndefinedValues(value);
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

/**
 * A generic Firestore API class for any collection.
 *   - T: the shape of your document data (without `id`)
 */
export class DatabaseApi<T extends object> extends Api {
  private collection: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;

  constructor(public collectionName: string, public actionName?: string) {
    super();
    // collection() returns a CollectionReference under the hood
    this.collection = collection(
      db,
      collectionName
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
    if (!actionName) {
      const cnLastIndex = collectionName.lastIndexOf("s");
      this.actionName =
        cnLastIndex === -1
          ? collectionName
          : collectionName.substring(0, cnLastIndex);
    }
  }

  /** Fetch all documents in the collection */
  async getAll(query?: Query): Promise<WithId<T>[]> {
    const coll = query ? this.getQuery(query) : this.collection;
    const snap = await getDocs(coll);
    return snap.docs.map((d: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
      id: d.id,
      ...(d.data() as T),
    }));
  }

  /** Fetch a single document by its ID */
  async getById(id: string): Promise<WithId<T> | null> {
    const ref = doc(db, this.collectionName, id);
    const snap = await getDoc(ref);
    if (!snap.exists) return null;
    return { id: snap.id, ...(snap.data() as T) };
  }

  /** Add a new document (Firestore auto‑generates the ID) */
  async create(data: Omit<T, "id">, options?: APIOptions): Promise<T> {
    // add timestamp
    const cleanedData = removeUndefinedValues(data);
    const ref = await addDoc(this.collection, {
      ...cleanedData,
      timestamp: serverTimestamp(),
    });
    if (options?.analyticsEvent) {
      this.logEvent(options?.analyticsEvent, "add");
    }
    return { id: ref.id, ...cleanedData } as T;
  }

  /** Overwrite (or create) a document with a known ID */
  async set(id: string, data: T): Promise<void> {
    const ref = doc(db, this.collectionName, id);
    const cleanedData = removeUndefinedValues(data);
    (cleanedData as any).timestamp = serverTimestamp();
    await setDoc(ref, cleanedData);
  }
  /** Update specific fields of a document */
  async update(id: string, data: UpdateData<T>): Promise<void> {
    try {
      console.log("update", data);
      const ref = doc(
        db,
        this.collectionName,
        id
      ) as unknown as FirebaseFirestoreTypes.DocumentReference<T>;
      delete (data as any).timestamp;
      const cleanedData = removeUndefinedValues(data) as UpdateData<T>;
      await updateDoc(ref, cleanedData);
    } catch (error) {
      console.error("Error updating document:", this.collectionName, error);
      throw error;
    }
  }

  /** Delete a document */
  async deleteById(id: string): Promise<void> {
    const ref = doc(db, this.collectionName, id);
    await deleteDoc(ref);
  }

  async delete(item: WithId<T>): Promise<void> {
    const ref = doc(db, this.collectionName, item.id);
    await deleteDoc(ref);
  }

  onQuerySnapshot = (
    observerCallback: (snapshot: QuerySnapshot<T>) => void,
    onError?: ((error: Error) => void) | undefined,
    query?: Query
  ) => {
    let collectionQuery = query
      ? this.getQuery(query, this.collection)
      : this.collection;

    return onSnapshot(
      collectionQuery as any,
      (snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => {
          const timestamp = (doc.data()?.timestamp as any)?.toDate();
          const item = {
            ...doc.data(),
            id: doc.id,
            timestamp,
          } as T;
          return item;
        });
        observerCallback({ ...snapshot, data });
      },
      (error) => {
        crashlytics.recordError(error);
        if (onError) {
          onError(error);
        }
      }
    );
  };

  onDocumentSnapshot(
    id: string,
    onNext: (data: WithId<T> | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    const ref = doc(
      db,
      this.collectionName,
      id
    ) as unknown as FirebaseFirestoreTypes.DocumentReference<T>;
    const unsubscribe = onSnapshot<T>(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const timestamp = (data as any)?.timestamp?.toDate?.();
          onNext({
            id: snapshot.id,
            ...(data as T),
            timestamp,
          });
        } else {
          onNext(null);
        }
      },
      onError
    );
    return unsubscribe;
  }

  /**
   * Subscribe to real-time updates for the entire collection.
   * @returns Unsubscribe function.
   */
  onCollectionSnapshot(
    onNext: (data: WithId<T>[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const unsubscribe = onSnapshot(
      this.collection,
      (snapshot) => {
        const items = snapshot.docs.map(
          (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: docSnap.id,
            ...(docSnap.data() as T),
          })
        );
        onNext(items);
      },
      onError
    );
    return unsubscribe;
  }

  async writeBatch(
    operations: {
      type: "set" | "update" | "delete";
      id: string;
      data?: Partial<T> | T;
    }[]
  ): Promise<void> {
    const batch = (db as any).batch() as FirebaseFirestoreTypes.WriteBatch;
    operations.forEach((op) => {
      const ref = doc(
        db,
        this.collectionName,
        op.id
      ) as unknown as FirebaseFirestoreTypes.DocumentReference<T>;
      if (op.type === "set") {
        batch.set(ref, op.data as T);
      } else if (op.type === "update") {
        batch.update(ref, op.data as Partial<T>);
      } else if (op.type === "delete") {
        batch.delete(ref);
      }
    });
    await batch.commit();
  }

  private getQuery = (
    query: Query,
    collectionQuery: FirebaseFirestoreTypes.Query | DataCollection<T> = this
      .collection
  ) => {
    return this.fromQuery(query, collectionQuery);
  };

  fromQuery(
    queryData: Query,
    collectionQuery: FirebaseFirestoreTypes.Query | DataCollection<T>
  ) {
    // We start with the base collection/query object
    // In modular v9+, we use the query() function to apply constraints
    // but the input collectionQuery is a React Native Firebase v15+ object
    // which still supports the chainable API for compatibility but prefers modular.
    // However, the warning specifically says "Method called was `where`... Please use `where()` instead".
    // This implies we should build an array of constraints or apply them using the modular functions.

    // Important: React Native Firebase (RNFB) v18+ still uses namespaced objects for references,
    // but we can pass them to the modular functions imported from the package.
    // Let's import the necessary modular functions at the top of the file first.

    /*
      Correct usage for RNFB v15+ modular style:
      import { query, where, orderBy, limit, startAfter } from '@react-native-firebase/firestore';
      
      const q = query(
        collectionRef,
        where('field', '==', 'value'),
        orderBy('field', 'desc'),
        limit(10)
      );
    */

    // Since we are receiving `collectionQuery` which might already be a query or a collection reference,
    // and `query()` takes a collection or query as the first argument, we can just wrap it.

    const constraints: any[] = [];

    if (queryData.filters && queryData.filters.length > 0) {
      for (const filter of queryData.filters) {
        if (!!filter.field && filter.value !== undefined) {
          const idField = filter.field === "id" ? "__name__" : filter.field;
          const newFilter: QueryFilter<T> = { ...filter, field: idField };
          const operation: Operation = newFilter.operation
            ? newFilter.operation
            : Operation.EQUAL;

          const whereFilter = where(
            newFilter.field as any,
            operation.toString() as FirebaseFirestoreTypes.WhereFilterOp,
            newFilter.value
          );
          constraints.push(whereFilter);
        }
      }
    }
    if (queryData.orderBy && queryData.orderBy.length > 0) {
      for (const sort of queryData.orderBy) {
        constraints.push(
          orderBy(
            sort.field as unknown as FirebaseFirestoreTypes.FieldPath,
            sort.direction || "asc"
          )
        );
      }
    }
    if (queryData.afterDoc) {
      constraints.push(startAfter(queryData.afterDoc));
    }

    constraints.push(
      limit(queryData.limit ?? constants.firebase.MAX_QUERY_LIMIT)
    );

    // Apply all constraints using the modular `query` function
    // Cast to any to avoid strict typing issues during migration if types mismatch slightly
    return query(collectionQuery as any, ...constraints);
  }

  logEvent(event: AnalyticsEvent, actionType: ActionType, error?: Error) {
    if (event && event.disabled) {
      return;
    }
    const obj = { ...event?.params };
    let name = `${actionType}_${this.actionName ?? this.collectionName}`;
    if (error) {
      name += "_error";
      obj.error = (error as any)?.code ?? error?.message;
    }
    return Analytics.logEvent(name, obj);
  }
}
