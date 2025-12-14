import { Config } from "@/utils/Config";
import {
  collection,
  FirebaseFirestoreTypes,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "@react-native-firebase/firestore";
import constants from "../config/constants";
import { crashlytics, db } from "../firebase";
import {
  DataCollection,
  Entity,
  Filter,
  Operation,
  Query,
} from "../types/DataTypes";
import { DocumentSnapshot, QuerySnapshot } from "../types/UtilityTypes";
import Analytics, { ActionType, AnalyticsEvent } from "../utils/Analytics";
import cache, { CacheConfig } from "../utils/cache/cacheManager";
import { Api, APIOptions, ApiResponse } from "./Api";

export interface WriteBatchInterface<T> {
  set: (data: Map<string, T>) => Promise<void>;
  update: (data: Map<string, Partial<T>>) => Promise<void>;
  delete: (ids: string[]) => Promise<void>;
}

export const FUNCTIONS_PREFIX = "new_";
export class DataApi<T extends Entity> extends Api {
  collection: DataCollection<T>;
  cacheStore: string;
  constructor(readonly collectionName: string, public actionName?: string) {
    super();
    this.collection = collection(
      db,
      Config.SCHEMA_PREFIX + collectionName
    ) as DataCollection<T>;
    this.cacheStore = collectionName;
    if (!actionName) {
      const cnLastIndex = collectionName.lastIndexOf("s");
      this.actionName =
        cnLastIndex === -1
          ? collectionName
          : collectionName.substring(0, cnLastIndex);
    }
  }

  writeBatchOps: WriteBatchInterface<T> = {
    set: (data: Map<string, T>) => {
      const dbBatch = writeBatch(db);
      data.forEach((item, key) => {
        const doc = this.collection.doc(key);
        dbBatch.set(doc, item);
      });
      return dbBatch.commit();
    },
    update: (data: Map<string, Partial<T>>) => {
      const dbBatch = writeBatch(db);
      data.forEach((item, key) => {
        const doc = this.collection.doc(key);
        dbBatch.update(doc, item);
      });
      return dbBatch.commit();
    },
    delete: (data: string[]) => {
      const dbBatch = writeBatch(db);
      data.forEach((id) => {
        const doc = this.collection.doc(id);
        dbBatch.delete(doc);
      });
      return dbBatch.commit();
    },
  };

  onDocumentSnapshot = (
    id: string,
    observerCallback: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void
  ) => {
    this.logger.debug("onDocumentSnapshot", id);
    return this.collection.doc(id).onSnapshot(
      (snapshot) => {
        const timestamp = (snapshot.data()?.timestamp as any)?.toDate();
        const docData: T = snapshot.data() as T;
        if (docData) {
          const doc: T = {
            ...(snapshot.data() as T),
            id: snapshot.id,
            timestamp,
          };
          observerCallback({ ...snapshot, doc });
        }
      },
      (error) => {
        crashlytics.recordError(error);
        if (onError) {
          onError(error);
        }
      }
    );
  };

  onQuerySnapshot = (
    observerCallback: (snapshot: QuerySnapshot<T>) => void,
    onError?: ((error: Error) => void) | undefined,
    query?: Query
  ) => {
    this.logger.debug("onQuerySnapshot", query);

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
        crashlytics.recordError(error);
        if (onError) {
          onError(error);
        }
      }
    );
  };

  getAll = async (query?: Query, options?: APIOptions) => {
    try {
      this.logger.debug("getAll", query, options);
      const coll = query ? this.getQuery(query) : this.collection;
      const snapshot = await coll.get();
      const items = snapshot.docs.map((doc) => {
        const item = {
          ...doc.data(),
          id: doc.id,
        } as T;
        if (doc.data()?.timestamp) {
          item.timestamp = (doc.data()?.timestamp as any)?.toDate();
        }
        return item;
      });
      if (items && items.length > 0) {
        const response: ApiResponse<T> = { items, query, docs: snapshot.docs };
        if (!!query?.limit && items.length === query.limit) {
          response.lastDoc = snapshot.docs.slice(-1)[0];
        }
        return response;
      }
    } catch (error) {
      this.logEvent(options?.analyticsEvent!, "query", error as Error)?.then();
      crashlytics.recordError(error as Error);
      this.logger.error(error);
      throw error;
    }
  };

  getById = async (id: string, options?: APIOptions) => {
    try {
      this.logger.debug("getById:", id, options);
      const snapshot = await this.collection.doc(id).get();
      if (snapshot.exists()) {
        const doc = {
          ...snapshot.data(),
          timestamp: (snapshot?.data()?.timestamp as any)?.toDate(),
          id,
        } as T;

        return doc;
      }
    } catch (error) {
      this.logEvent(options?.analyticsEvent!, "query", error as Error);
      crashlytics.recordError(error as Error);
      this.logger.error(error);
      throw error;
    }
  };

  add = async (doc: Omit<T, "id">, options?: APIOptions) => {
    try {
      // this.logger.debug('add:', doc, options);

      const timestamp = serverTimestamp();
      const id = await this.collection.doc().id;

      const createdDoc: T = { ...this.removeEmpty(doc as T), timestamp };
      await this.collection.doc(id).set(createdDoc);

      createdDoc.id = id;
      this.logEvent(options?.analyticsEvent!, "add")?.then();

      return createdDoc as T;
    } catch (error) {
      this.logEvent(options?.analyticsEvent!, "add", error as Error)?.then();
      crashlytics.recordError(error as Error);
      throw error;
    }
  };

  set = async (id: string, doc: T, options?: APIOptions) => {
    try {
      this.logger.debug("set:", id, options);
      const timestamp = serverTimestamp();
      const createdDoc: T = { id, ...this.removeEmpty(doc as T), timestamp };
      await this.collection.doc(id).set(createdDoc);
      this.logEvent(options?.analyticsEvent!, "add");
      return createdDoc;
    } catch (error) {
      this.logEvent(options?.analyticsEvent!, "add", error as Error);
      crashlytics.recordError(error as Error);
      this.logger.error("set", error);
      throw error;
    }
  };

  update = async (id: string, doc: Partial<T>, options?: APIOptions) => {
    try {
      this.logger.debug("update:", id);
      const newDoc: Partial<T> = { ...doc };
      delete newDoc.timestamp;
      await this.collection.doc(id).update(newDoc as any);
      this.logEvent(options?.analyticsEvent!, "update");
    } catch (error) {
      this.logEvent(options?.analyticsEvent!, "update", error as Error);
      crashlytics.recordError(error as Error);
      throw error;
    }
  };

  deleteById = async (docId: string, options?: APIOptions) => {
    try {
      this.logger.debug("deleteById:", docId);
      await this.collection.doc(docId).delete();
      this.logEvent(options?.analyticsEvent!, "delete");
    } catch (error) {
      this.logEvent(options?.analyticsEvent!, "delete", error as Error);
      crashlytics.recordError(error as Error);
      throw error;
    }
  };

  delete = async (doc: T, options?: APIOptions) => {
    try {
      this.logger.debug("delete:", doc.id);
      await this.collection.doc(doc.id).delete();
      this.logEvent(options?.analyticsEvent!, "delete");
    } catch (error) {
      this.logEvent(options?.analyticsEvent!, "delete", error as Error);
      crashlytics.recordError(error as Error);
      throw error;
    }
  };

  getNewId() {
    return this.collection.doc().id;
  }

  private evict = (list: string | string[]) => {
    const promises: Promise<void>[] = [];
    if (Array.isArray(list)) {
      list.forEach((item) => {
        promises.push(cache.remove(item));
      });
    } else {
      promises.push(cache.remove(list));
    }
    return Promise.all(promises);
  };

  private removeEmpty = (obj: T) => {
    return JSON.parse(JSON.stringify(obj));
  };

  private getQuery = (
    query: Query,
    collectionQuery: FirebaseFirestoreTypes.Query | DataCollection<T> = this
      .collection
  ) => {
    return DataApi.fromQuery(query, collectionQuery);
  };

  private buildKeyFrom = (cacheConfig: CacheConfig, query?: Query) => {
    const key =
      cacheConfig?.key ??
      `${this.cacheStore}_${query ? JSON.stringify(query) : ""}`;
    return key;
  };

  static fromQuery(
    query: Query,
    collectionQuery: FirebaseFirestoreTypes.Query | DataCollection<T>
  ) {
    if (query.filters && query.filters.length > 0) {
      for (const filter of query.filters) {
        if (!!filter.field && filter.value !== undefined) {
          const idField = filter.field === "id" ? "__name__" : filter.field;
          const newFilter: Filter<T> = { ...filter, field: idField };
          const operation: Operation = newFilter.operation
            ? newFilter.operation
            : Operation.EQUAL;

          collectionQuery = collectionQuery.where(
            newFilter.field as any,
            operation.toString() as FirebaseFirestoreTypes.WhereFilterOp,
            newFilter.value
          );
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

  static toTimestamp(date: Date | number) {
    const convertedDate = date instanceof Date ? date : new Date(date);
    return Timestamp.fromDate(convertedDate);
  }

  static createFrom<R extends Entity>(collectionName: string) {
    // switch (collectionName) {
    //   case itemsApi.collectionName:
    //     return itemsApi;
    //   case itemsApi.collectionName:
    //     return itemsApi;

    //   default:
    //     return new DataApi(collectionName);
    // }
    return new DataApi<R>(collectionName);
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

  static getServerTimeStamp() {
    return serverTimestamp();
  }
  static getServerDate() {
    // const timestamp = firestore.FieldValue.serverTimestamp();
    // return timestamp ? (timestamp as any).toDate() : undefined;
    return new Date();
  }
}
