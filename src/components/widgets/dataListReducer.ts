export type DataListInitState = {
  loading: boolean;
  reloading: boolean;
  items: any[];
  lastDoc?: any;
  hasMore?: boolean;
};

interface SetLoadingeAction {
  type: 'SET_LOADING';
  loading: boolean;
}

interface SetReLoadingeAction {
  type: 'SET_RELOADING';
  reloading: boolean;
}

interface SetItemsAction<T> {
  type: 'SET_ITEMS';
  items: T[];
  lastDoc?: any;
}
interface ResetAction {
  type: 'RESET';
  loading?: boolean;
}
interface SetItemsAction<T> {
  type: 'SET_ITEMS';
  items: T[];
  lastDoc?: any;
}

interface AddItemsAction<T> {
  type: 'LOAD_MORE_ITEMS';
  items: T[];
  reloading: boolean;
  lastDoc?: any;
}

interface FinishLoadingAction {
  type: 'FINISH_LOADING';
}

type DataListAction<T> =
  | SetLoadingeAction
  | SetReLoadingeAction
  | SetItemsAction<T>
  | AddItemsAction<T>
  | ResetAction
  | FinishLoadingAction;

function dataListReducer<T>(
  draftState: DataListInitState,
  action: DataListAction<T>,
) {
  switch (action.type) {
    case 'SET_LOADING':
      draftState.loading = action.loading;
      return draftState;
    case 'SET_RELOADING':
      draftState.reloading = action.reloading;
      return draftState;
    case 'RESET':
      draftState = initialState;
      draftState.loading = !!action?.loading;
      return draftState;
    case 'SET_ITEMS':
      draftState.items = action.items;
      if (action.lastDoc) {
        draftState.lastDoc = action.lastDoc;
        draftState.hasMore = true;
      } else {
        draftState.hasMore = false;
      }
      draftState.reloading = false;
      draftState.loading = false;
      return draftState;
    case 'LOAD_MORE_ITEMS':
      draftState.items = [...draftState.items, ...action.items];
      draftState.lastDoc = action.lastDoc;
      if (action.lastDoc) {
        draftState.hasMore = true;
      } else {
        draftState.hasMore = false;
      }
      draftState.reloading = false;
      draftState.loading = false;
      return draftState;
    case 'FINISH_LOADING':
      draftState.loading = false;
      draftState.reloading = false;
      draftState.lastDoc = undefined;
      draftState.hasMore = false;
      return draftState;
    default:
      return draftState;
  }
}

export default dataListReducer;
