import { Item } from "@/api/itemsApi";
import { searchApi } from "@/api/search/searchApi";
import { Query } from "@/types/DataTypes";
import { Config } from "@/utils/Config";
import { createNullCache } from "@algolia/cache-common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { algoliasearch, SearchClient } from "algoliasearch";
import { useMemo } from "react";

interface PaginationOptions {
  itemsPerPage?: number;
}

interface AlgoliaPageResult {
  items: Item[];
  page: number;
  nbPages: number;
  totalItems: number;
}

interface UseAlgoliaQueryOptions {
  indexName: string;
  query?: Query;
  searchParams?: Record<string, any>;
  pagination?: PaginationOptions;
  enabled?: boolean;
  select?: (data: any) => Item;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hitsPerPage: number;
  hasMore: boolean;
}

interface UseAlgoliaQueryResult<TData = any> {
  data: TData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isSuccess: boolean;
  pagination: PaginationState;
  loadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// Global Algolia client singleton
let algoliaClient: SearchClient | null = null;

algoliaClient = algoliasearch(
  Config.algolia.ALGOLIA_APP_KEY,
  Config.algolia.ALGOLIA_SEARCH_KEY,
  {
    // Caches responses from Algolia
    // responsesCache: createInMemoryCache(), // or createNullCache()
    responsesCache: createNullCache(), // or createNullCache()

    // Caches Promises with the same request payload
    // requestsCache: createInMemoryCache({serializable: false}), // or createNullCache()
    requestsCache: createNullCache(),
  }
);

export const getAlgoliaClient = (): SearchClient => {
  return algoliaClient;
};

// Custom hook using TanStack Query
export const useAlgoliaQuery = ({
  indexName,
  query = {},
  searchParams = {},
  pagination: paginationOptions,
  enabled = true,
  select,
}: UseAlgoliaQueryOptions) => {
  const hitsPerPage = paginationOptions?.itemsPerPage ?? 20;

  const infiniteQuery = useInfiniteQuery<AlgoliaPageResult, Error>({
    queryKey: [
      "algolia",
      indexName,
      query.searchText,
      query.filters,
      query.orderBy,
      searchParams,
      hitsPerPage,
    ] as any,
    queryFn: async ({ pageParam }): Promise<AlgoliaPageResult> => {
      const page = typeof pageParam === "number" ? pageParam : 0;
      const client = getAlgoliaClient();

      const result = await searchApi.search<Item>(query);

      // const queryBuilder = QueryBuilder.fromQuery(query);

      // // Build search parameters from query object
      // const algoliaSearchParams: Record<string, any> = {
      //   query: query.searchText || "",
      //   ...searchParams,
      //   page: page,
      //   hitsPerPage,
      // };

      // // Add filters if provided
      // if (query.filters) {
      //   algoliaSearchParams.filters = query.filters;
      // }

      // // Add ranking/sorting if provided
      // if (query.orderBy) {
      //   algoliaSearchParams.ranking = query.orderBy;
      // }

      // // Algolia v5 API
      // const result = await client.searchSingleIndex({
      //   indexName,
      //   searchParams: algoliaSearchParams,
      // });

      return {
        items: result.items || [],
        page: page,
        nbPages: result.page?.totalPages || 0,
        totalItems: result.page?.totalDocs || 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: AlgoliaPageResult) => {
      const nextPage = lastPage.page + 1;
      return nextPage < lastPage.nbPages ? nextPage : undefined;
    },
    enabled,
  });

  // Flatten all pages into a single result
  const data = useMemo(() => {
    if (!infiniteQuery.data) return undefined;

    const allHits = infiniteQuery.data.pages.flatMap((page) => page.items);
    const lastPage =
      infiniteQuery.data.pages[infiniteQuery.data.pages.length - 1];

    const result = {
      items: allHits,
      totalItems: lastPage?.totalItems || 0,
      nbPages: lastPage?.nbPages || 0,
      page: lastPage?.page || 0,
    } as AlgoliaPageResult;

    return result;
  }, [infiniteQuery.data]);

  // Calculate pagination state
  const pagination = useMemo((): PaginationState => {
    const lastPage =
      infiniteQuery.data?.pages[infiniteQuery.data.pages.length - 1];
    const currentPage = lastPage?.page ?? 0;
    const totalPages = lastPage?.nbPages ?? 0;
    const totalItems = lastPage?.totalItems ?? 0;

    return {
      currentPage,
      totalPages,
      totalItems,
      hitsPerPage,
      hasMore: infiniteQuery.hasNextPage ?? false,
    };
  }, [infiniteQuery.data, infiniteQuery.hasNextPage, hitsPerPage]);

  return {
    data,
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    isError: infiniteQuery.isError,
    error: infiniteQuery.error,
    refetch: infiniteQuery.refetch,
    isSuccess: infiniteQuery.isSuccess,
    pagination,
    loadMore: () => {
      if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
        infiniteQuery.fetchNextPage();
      }
    },
    hasNextPage: infiniteQuery.hasNextPage ?? false,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
  };
};
