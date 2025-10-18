import {ApiResponse} from '../../api/Api';
import {Page, Query} from '../../types/DataTypes';

export type DataState<T> = {
  items?: T[];
  page?: Page;
  query?: Query;
  hasMore?: boolean;
  initialLoading?: boolean;
  moreLoading?: boolean;
  isRefreshing?: boolean;
  error?: Error;
};

interface SetDataAction<T> {
  type: 'SET_DATA';
  query: Query;
  data: ApiResponse<T>;
}
interface SetLoadingAction {
  type: 'SET_INITIAL_LOADING';
  initialLoading: boolean;
}
interface SetMoreLoadingAction {
  type: 'SET_MORE_LOADING';
  moreLoading: boolean;
}

interface SetErrorAction {
  type: 'SET_ERROR';
  error: Error;
  initialLoading?: boolean;
  moreLoading?: boolean;
}

interface LoadMoreAction<T> {
  type: 'LOAD_MORE';
  data: ApiResponse<T>;
}
interface SetRefreshingAction {
  type: 'SET_REFRESHING';
  isRefreshing: boolean;
}

export type StateActions<T> =
  | SetDataAction<T>
  | SetErrorAction
  | SetLoadingAction
  | SetMoreLoadingAction
  | SetRefreshingAction
  | LoadMoreAction<T>;

function reset<T>(draftState: DataState<T>) {
  draftState.error = undefined;
  draftState.hasMore = false;
  draftState.initialLoading = false;
  draftState.isRefreshing = false;
  draftState.items = undefined;
  draftState.moreLoading = false;
  draftState.page = undefined;
  draftState.query = undefined;
}

function setData<T>(
  draftState: DataState<T>,
  action: SetDataAction<T>,
): DataState<T> {
  reset(draftState);
  draftState.items = action.data.items;
  draftState.page = action.data.page;
  draftState.query = action.query;
  let savedQuery = null;
  if (
    action.data.items?.length > 0 &&
    action.data.items.length <= action.data?.page?.totalDocs!
  ) {
    savedQuery = {
      ...action.query,
      page: action.data.page,
    };
  } else {
    savedQuery = {...draftState.query};
  }
  draftState.query = savedQuery;

  if (action.data?.page) {
    draftState.page = action.data?.page;
    draftState.hasMore =
      action.data?.page?.totalPages > action.data?.page?.index + 1;
  }

  draftState.initialLoading = false;
  draftState.isRefreshing = false;
  return draftState;
}

// const logger = LoggerFactory.getLogger('QueryReducer');

function QueryReducer<T>(draftState: DataState<T>, action: StateActions<T>) {
  switch (action.type) {
    case 'SET_DATA':
      return setData(draftState, action);
    case 'SET_INITIAL_LOADING':
      draftState.initialLoading = action.initialLoading;
      return draftState;
    case 'SET_MORE_LOADING':
      draftState.moreLoading = action.moreLoading;
      return draftState;
    case 'SET_REFRESHING':
      draftState.isRefreshing = action.isRefreshing;
      return draftState;

    case 'SET_ERROR':
      draftState.error = action.error;
      draftState.moreLoading = action.moreLoading ?? draftState.moreLoading;
      draftState.initialLoading =
        action.initialLoading ?? draftState.initialLoading;
      return draftState;

    case 'LOAD_MORE':
      draftState.items = draftState.items
        ? [...draftState.items, ...action.data.items]
        : action.data.items;
      draftState.moreLoading = false;
      draftState.query = {...draftState.query, page: action.data.page};
      draftState.page = action.data?.page;
      if (action.data?.page) {
        draftState.hasMore =
          action.data?.page?.totalPages > action.data?.page?.index + 1;
      }
      return draftState;

    default:
      return draftState;
  }
}

export default QueryReducer;
