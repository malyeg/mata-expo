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
import crashlytics from "@react-native-firebase/crashlytics";
import type {
  FirebaseFirestoreTypes,
  UpdateData,
} from "@react-native-firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Filter,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore";
import { db } from "../firebase";
import { Api } from "./Api";

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
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
  }

  /** Fetch a single document by its ID */
  async getById(id: string): Promise<WithId<T> | null> {
    const ref = doc(db, this.collectionName, id);
    const snap = await getDoc(ref);
    if (!snap.exists) return null;
    return { id: snap.id, ...(snap.data() as T) };
  }

  /** Add a new document (Firestore auto‑generates the ID) */
  async create(data: Omit<T, "id">): Promise<T> {
    // add timestamp
    const ref = await addDoc(this.collection, {
      ...data,
      timestamp: serverTimestamp(),
    });
    return { id: ref.id, ...data } as T;
  }

  /** Overwrite (or create) a document with a known ID */
  async set(id: string, data: T): Promise<void> {
    delete (data as any).timestamp;
    const ref = doc(db, this.collectionName, id);
    const cleanedData = removeUndefinedValues(data);
    await setDoc(ref, cleanedData);
  }
  /** Update specific fields of a document */
  async update(id: string, data: UpdateData<T>): Promise<void> {
    const ref = doc(
      db,
      this.collectionName,
      id
    ) as unknown as FirebaseFirestoreTypes.DocumentReference<T>;
    await updateDoc(ref, data);
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

    return collectionQuery.onSnapshot(
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
        crashlytics().recordError(error);
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
          console.log("data!!!", JSON.stringify((data as any)?.timestamp));
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
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as T),
        }));
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
    query: Query,
    collectionQuery: FirebaseFirestoreTypes.Query | DataCollection<T>
  ) {
    if (query.filters && query.filters.length > 0) {
      for (const filter of query.filters) {
        if (!!filter.field && filter.value !== undefined) {
          const idField = filter.field === "id" ? "__name__" : filter.field;
          const newFilter: QueryFilter<T> = { ...filter, field: idField };
          const operation: Operation = newFilter.operation
            ? newFilter.operation
            : Operation.EQUAL;

          const whereFilter = Filter(
            newFilter.field as any,
            operation.toString() as FirebaseFirestoreTypes.WhereFilterOp,
            newFilter.value
          );
          collectionQuery = collectionQuery.where(whereFilter);
        }
      }
    }
    if (query.orderBy && query.orderBy.length > 0) {
      for (const sort of query.orderBy) {
        collectionQuery = collectionQuery.orderBy(
          sort.field as unknown as FirebaseFirestoreTypes.FieldPath,
          sort.direction || "asc"
        );
      }
    }
    if (query.afterDoc) {
      collectionQuery = collectionQuery.startAfter(query.afterDoc);
    }
    collectionQuery = collectionQuery.limit(
      query.limit ?? constants.firebase.MAX_QUERY_LIMIT
    );

    return collectionQuery;
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
