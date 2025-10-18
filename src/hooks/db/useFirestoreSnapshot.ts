import { DatabaseApi } from "@/api/DatabaseApi";
import { useEffect, useState } from "react";
import { DataApi } from "../../api/DataApi";
import { Document, Entity, Query, QueryBuilder } from "../../types/DataTypes";

export function useFirestoreSnapshot<T extends Entity>({
  collectionName,
  query,
  docMapper,
  onLoadFinish,
}: {
  collectionName: string;
  query?: Query;
  docMapper?: (doc: Document) => T;
  onLoadFinish?: () => void;
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentQuery, setCurrentQuery] = useState<Query | undefined>(query);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let snapshotSub: () => void;

    try {
      const dataApi = new DataApi<T>(collectionName);
      let collectionQuery = currentQuery
        ? DatabaseApi.fromQuery<T>({ ...currentQuery }, dataApi.collection)
        : dataApi.collection;

      snapshotSub = collectionQuery.onSnapshot(
        (snapshot) => {
          const docs = snapshot.docs.map((doc) =>
            docMapper ? docMapper(doc) : (doc.data() as T)
          );
          setData(docs);
          setLoading(false);
          if (onLoadFinish) {
            onLoadFinish();
          }
        },
        (err) => {
          setError(err as Error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setError(err as Error);
      setLoading(false);
    }

    return () => {
      if (snapshotSub) {
        snapshotSub();
      }
    };
  }, [collectionName, currentQuery, docMapper, onLoadFinish]);

  const updateQuery = (newQuery: Query<T>) => {
    if (!QueryBuilder.equal(newQuery, currentQuery)) {
      setCurrentQuery(newQuery);
    } else {
      console.log("queries are equal");
    }
  };

  return {
    data,
    loading,
    error,
    query: currentQuery,
    updateQuery,
  };
}
