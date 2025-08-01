import { Item } from "@//api/itemsApi";
import itemsSearchApi from "@//api/search/itemsSearchApi";
import SearchApi from "@//api/search/searchApi";
import constants from "@//config/constants";
import { Query } from "@//types/DataTypes";
import { LoggerFactory } from "@//utils/logger";
import { useCallback } from "react";
import { Reducer, useImmerReducer } from "use-immer";
import queryReducer, { DataState, StateActions } from "./QueryReducer";
interface QueryProps {
  collectionName: string;
}
const logger = LoggerFactory.getLogger("useSearchQuery");

export function useSearchQuery<T>({ collectionName }: QueryProps) {
  const [state, dispatch] = useImmerReducer(
    queryReducer as Reducer<DataState<T>, StateActions<T>>,
    {}
  );

  const loadData = useCallback(
    async (query: Query, initialLoading = true) => {
      // logger.debug('loadData', query);
      initialLoading &&
        dispatch({
          type: "SET_INITIAL_LOADING",
          initialLoading,
        });

      try {
        const searchApi = getApi(collectionName);

        const data = await searchApi.search(query);
        dispatch({
          type: "SET_DATA",
          query,
          data,
        });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          error: error as Error,
          initialLoading: false,
        });
        logger.error("loadData", error);
      }
    },
    [collectionName, dispatch]
  );

  const refreshData = useCallback(async () => {
    logger.debug("refreshData");
    if (!state.query) {
      return;
    }
    dispatch({
      type: "SET_REFRESHING",
      isRefreshing: true,
    });
    try {
      const searchApi = getApi(collectionName);
      const newQuery = { ...state.query, page: undefined };
      const data = await searchApi.search(newQuery);
      dispatch({
        type: "SET_DATA",
        query: newQuery,
        data,
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        error: error as Error,
      });
    }
  }, [collectionName, dispatch, state.query]);

  const loadMore = useCallback(async () => {
    if (
      !state.hasMore ||
      state.moreLoading ||
      (!!state?.page && state.page?.index + 1 >= state.page?.totalPages)
    ) {
      logger.debug("ignoring loadmore call");
      return;
    }

    try {
      logger.debug("loadMore");
      dispatch({
        type: "SET_MORE_LOADING",
        moreLoading: true,
      });
      let page: Query["page"] = {
        index: state.query?.page?.index ? state.query?.page?.index + 1 : 1,
        size: state.query?.page?.size ?? constants.page.SIZE,
      };
      const searhApi = getApi(collectionName);
      const newQuery: Query = { ...state.query, page };
      const resp = await searhApi.search(newQuery);
      dispatch({
        type: "LOAD_MORE",
        data: resp,
      });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        error: error as Error,
        moreLoading: false,
      });
    }
  }, [
    collectionName,
    dispatch,
    state.hasMore,
    state.moreLoading,
    state.page,
    state.query,
  ]);

  return { loadMore, refreshData, loadData, ...state };
}

function getApi(collectionName: string) {
  switch (collectionName) {
    case "items":
      return itemsSearchApi as SearchApi<Item>;

    default:
      throw new Error("unmapped collection " + collectionName);
  }
}
