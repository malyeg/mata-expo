import { Category } from "@/api/categoriesApi";
import { ConditionType, Item, SwapType } from "@/api/itemsApi";
import { searchApi } from "@/api/search/searchApi";
import categories from "@/data/categories";
import { Query } from "@/types/DataTypes";
import { Config } from "@/utils/Config";
import { createNullCache } from "@algolia/cache-common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { algoliasearch, SearchClient } from "algoliasearch";
import { useMemo } from "react";

// Helper function to find category by path
const findCategoryByPath = (
  catLevel1?: string,
  catLevel2?: string,
  catLevel3?: string
): Category | undefined => {
  const pathToMatch: string[] = [catLevel1, catLevel2, catLevel3].filter(
    Boolean
  ) as string[];

  if (pathToMatch.length === 0) return undefined;

  return (categories as Category[]).find((cat) => {
    if (!cat.path || cat.path.length !== pathToMatch.length) return false;
    return cat.path.every((p, i) => p === pathToMatch[i]);
  });
};

// Transform Algolia search result to Item type
const transformAlgoliaToItem = (algoliaHit: any): Item => {
  const category =
    findCategoryByPath(
      algoliaHit.catLevel1,
      algoliaHit.catLevel2,
      algoliaHit.catLevel3
    ) ||
    ({
      id: algoliaHit.catLevel3 || algoliaHit.catLevel2 || algoliaHit.catLevel1,
      name:
        algoliaHit.catLevel3 || algoliaHit.catLevel2 || algoliaHit.catLevel1,
    } as Category);

  return {
    id: algoliaHit.objectID,
    objectID: algoliaHit.objectID,
    userId: algoliaHit.userId,
    user: {
      id: algoliaHit.userId,
      rating: algoliaHit.userRating,
    } as any,
    name: algoliaHit.name,
    category,
    catLevel1: algoliaHit.catLevel1,
    catLevel2: algoliaHit.catLevel2,
    catLevel3: algoliaHit.catLevel3,
    condition: {
      type: algoliaHit.conditionType as ConditionType,
      name: algoliaHit.conditionName,
      desc: algoliaHit.conditionDesc,
    },
    description: algoliaHit.description,
    defaultImageURL: algoliaHit.defaultImageURL,
    images: algoliaHit.images,
    location: algoliaHit._geoloc
      ? ({
          coordinate: {
            latitude: algoliaHit._geoloc.lat,
            longitude: algoliaHit._geoloc.lng,
          },
          countryId: algoliaHit.countryId,
          stateId: algoliaHit.stateId,
        } as any)
      : undefined,
    views: algoliaHit.views,
    timestamp: algoliaHit.timestamp
      ? new Date(algoliaHit.timestamp)
      : undefined,
    status: algoliaHit.status || "online",
    swapOption: {
      type: algoliaHit.swapOptionType as SwapType,
      category: algoliaHit.swapCategory,
    },
    swapOptionType: algoliaHit.swapOptionType,
    offers: algoliaHit.offers,
    archived: algoliaHit.archived,
  };
};

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
      JSON.stringify(query.filters),
      JSON.stringify(query.orderBy),
      searchParams,
      hitsPerPage,
    ] as any,
    queryFn: async ({ pageParam }): Promise<AlgoliaPageResult> => {
      const page = typeof pageParam === "number" ? pageParam : 0;
      const result = await searchApi.search<Item>(query);

      // Transform Algolia hits to Item objects
      const transformedItems = (result.items || []).map(transformAlgoliaToItem);

      return {
        items: transformedItems,
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

  const isLoadingState =
    infiniteQuery.isLoading ||
    (infiniteQuery.isFetching && !infiniteQuery.data);

  return {
    data,
    isLoading: isLoadingState,
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
