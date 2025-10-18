import { Document, Entity, Query } from "@/types/DataTypes";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type DataState<T> = {
  data?: T[];
  loading?: boolean;
  error?: Error;
  query?: Query<T>;
  docMapper?: (doc: Document<T>) => T;
  // lastDoc?: Document;
  // currentPage?: number;
};

interface SetDocsAction<T> {
  type: "SET_DOCS";
  docs: FirebaseFirestoreTypes.QueryDocumentSnapshot<Entity>[];
  docMapper: DataState<T>["docMapper"];
}
interface SetLoadingAction {
  type: "SET_LOADING";
  loading: boolean;
}
interface SetErrorAction {
  type: "SET_ERROR";
  error: Error;
}

interface UpdateQueryAction {
  type: "UPDATE_QUERY";
  query: Query<Entity>;
}

export type StateActions<T> =
  | SetDocsAction<T>
  | SetErrorAction
  | SetLoadingAction
  // | NextPageAction
  | UpdateQueryAction;

function firestoreSnapshotReducer<T>(
  draftState: DataState<T>,
  action: StateActions<T>
) {
  switch (action.type) {
    case "SET_DOCS":
      draftState.data = action.docs.map(action.docMapper ?? getDocData);
      draftState.loading = false;
      return draftState;
    case "SET_LOADING":
      draftState.loading = action.loading;
      return draftState;
    case "UPDATE_QUERY":
      draftState.data = undefined;
      // draftState.lastDoc = undefined;
      draftState.query = action.query;
      return draftState;
    case "SET_ERROR":
      draftState.error = action.error;
      draftState.loading = false;
      return draftState;
    default:
      return draftState;
  }
}

function getDocData<T extends Entity>(doc: Document<T>) {
  const timestamp = (doc?.data()?.timestamp as any)?.toDate();
  return {
    ...doc?.data(),
    id: doc?.id,
    timestamp,
  };
}

export default firestoreSnapshotReducer;
