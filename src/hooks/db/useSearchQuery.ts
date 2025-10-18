import { useCallback, useRef, useState } from "react";
import { Item } from "../../api/itemsApi";
import itemsSearchApi from "../../api/search/itemsSearchApi";
import SearchApi from "../../api/search/searchApi";
import constants from "../../config/constants";
import { Query } from "../../types/DataTypes";
import { LoggerFactory } from "../../utils/logger";

interface QueryProps {
  collectionName: string;
}

interface SearchState<T> {
  data: T[];
  query: Query | null;
  initialLoading: boolean;
  moreLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  hasMore: boolean;
  page: {
    index: number;
    totalPages: number;
    totalDocs: number;
    size: number;
  } | null;
}

const logger = LoggerFactory.getLogger("useSearchQuery");

export function useSearchQuery<T>({ collectionName }: QueryProps) {
  const [state, setState] = useState<SearchState<T>>({
    data: [],
    query: null,
    initialLoading: false,
    moreLoading: false,
    isRefreshing: false,
    error: null,
    hasMore: true,
    page: null,
  });

  // Store everything in refs to avoid dependencies
  const stateRef = useRef(state);
  const collectionNameRef = useRef(collectionName);

  // Update refs when values change
  stateRef.current = state;
  collectionNameRef.current = collectionName;

  // NO dependencies - completely stable functions
  const loadData = useCallback(
    async (query: Query, initialLoading = true) => {
      if (initialLoading) {
        setState((prev) => ({ ...prev, initialLoading: true, error: null }));
      }

      try {
        const searchApi = getApi(collectionNameRef.current);
        const response = await searchApi.search(query);

        setState((prev) => ({
          ...prev,
          data: (response.items as T[]) || [],
          query,
          initialLoading: false,
          error: null,
          hasMore: response.hasMore ?? true,
          page: response.page || null,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error as Error,
          initialLoading: false,
        }));
        logger.error("loadData", error);
      }
    },
    [] // NO dependencies
  );

  const refreshData = useCallback(async () => {
    logger.debug("refreshData");
    const currentState = stateRef.current;

    if (!currentState.query) {
      return;
    }

    setState((prev) => ({ ...prev, isRefreshing: true, error: null }));

    try {
      const searchApi = getApi(collectionNameRef.current);
      const newQuery = { ...currentState.query, page: undefined };
      const response = await searchApi.search(newQuery);

      setState((prev) => ({
        ...prev,
        data: response.data || [],
        query: newQuery,
        isRefreshing: false,
        hasMore: response.hasMore ?? true,
        page: response.page || null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
        isRefreshing: false,
      }));
      logger.error("refreshData", error);
    }
  }, []); // NO dependencies

  const loadMore = useCallback(async () => {
    const currentState = stateRef.current;

    if (
      !currentState.hasMore ||
      currentState.moreLoading ||
      (currentState.page &&
        currentState.page.index + 1 >= currentState.page.totalPages)
    ) {
      logger.debug("ignoring loadmore call");
      return;
    }

    setState((prev) => ({ ...prev, moreLoading: true, error: null }));

    try {
      logger.debug("loadMore");

      const page: Query["page"] = {
        index: currentState.query?.page?.index
          ? currentState.query.page.index + 1
          : 1,
        size: currentState.query?.page?.size ?? constants.page.SIZE,
      };

      const searchApi = getApi(collectionNameRef.current);
      const newQuery: Query = { ...currentState.query, page };
      const response = await searchApi.search(newQuery);

      setState((prev) => ({
        ...prev,
        data: [...prev.data, ...((response.items as T[]) || [])],
        query: newQuery,
        moreLoading: false,
        hasMore: response.hasMore ?? true,
        page: response.page || null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
        moreLoading: false,
      }));
      logger.error("loadMore", error);
    }
  }, []); // NO dependencies

  return {
    // Actions - these are now completely stable
    loadData,
    refreshData,
    loadMore,
    // State
    data: state.data,
    query: state.query,
    initialLoading: state.initialLoading,
    moreLoading: state.moreLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    hasMore: state.hasMore,
    page: state.page,
  };
}

function getApi(collectionName: string) {
  switch (collectionName) {
    case "items":
      return itemsSearchApi as SearchApi<Item>;
    default:
      throw new Error("unmapped collection " + collectionName);
  }
}
