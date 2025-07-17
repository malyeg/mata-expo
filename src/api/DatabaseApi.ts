// src/api/DatabaseApi.ts
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "@react-native-firebase/firestore";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { UpdateData } from "@react-native-firebase/firestore";

export type WithId<T> = T & { id: string };

/**
 * A generic Firestore API class for any collection.
 *   - T: the shape of your document data (without `id`)
 */
export class DatabaseApi<T extends object> {
  private collectionRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;

  constructor(private collectionName: string) {
    // collection() returns a CollectionReference under the hood
    this.collectionRef = collection(
      db,
      collectionName
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  }

  /** Fetch all documents in the collection */
  async getAll(): Promise<WithId<T>[]> {
    const snap = await getDocs(this.collectionRef);
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
  async create(data: Omit<T, "id">): Promise<string> {
    const ref = await addDoc(this.collectionRef, data);
    return ref.id;
  }

  /** Overwrite (or create) a document with a known ID */
  async set(id: string, data: T): Promise<void> {
    const ref = doc(db, this.collectionName, id);
    await setDoc(ref, data);
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
  async delete(id: string): Promise<void> {
    const ref = doc(db, this.collectionName, id);
    await deleteDoc(ref);
  }

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
        if (snapshot.exists) {
          onNext({ id: snapshot.id, ...(snapshot.data() as T) });
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
      this.collectionRef,
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
    operations: Array<{
      type: "set" | "update" | "delete";
      id: string;
      data?: Partial<T> | T;
    }>
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
}
