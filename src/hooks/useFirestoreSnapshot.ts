import { DataApi } from "@/api/DataApi";
import { Document, Entity, Query, QueryBuilder } from "@/types/DataTypes";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import firestoreSnapshotReducer from "./db/FirestoreSnapshotReducer";
import { DataState } from "./QueryReducer";

export function useFirestoreSnapshot<T extends Entity>({
  collectionName,
  query,
  docMapper,
  onLoadFinish,
}: {
  collectionName: string;
  query?: Query;
  docMapper?: (doc: Document<T>) => T;
  onLoadFinish?: () => void;
}) {
  const [state, dispatch] = useImmerReducer(firestoreSnapshotReducer, {
    query,
  } as DataState<T>);

  useEffect(() => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    let snapshotSub: () => void;
    try {
      const dataApi = new DataApi<T>(collectionName);
      let collectionQuery = state.query
        ? DataApi.fromQuery<T>({ ...state.query }, dataApi.collection)
        : dataApi.collection;

      snapshotSub = collectionQuery.onSnapshot(
        (snapshot) => {
          dispatch({ type: "SET_DOCS", docs: snapshot.docs, docMapper });
          if (onLoadFinish) {
            onLoadFinish();
          }
        },
        (error) => {
          dispatch({ type: "SET_ERROR", error });
        }
      );
    } catch (error) {
      console.error(error);
    }

    return () => {
      if (snapshotSub) {
        snapshotSub();
      }
    };
  }, [collectionName, dispatch, docMapper, onLoadFinish, state.query]);

  const updateQuery = (newQuery: Query<T>) => {
    if (!QueryBuilder.equal(newQuery, state?.query)) {
      dispatch({ type: "UPDATE_QUERY", query: newQuery });
    } else {
      console.log("queries are equal");
    }
  };
  return {
    ...state,
    // loadMore,
    updateQuery,
  };
}
