import { Config } from "@/utils/Config";
import { createNullCache } from "@algolia/cache-common";
import { SearchClient, algoliasearch } from "algoliasearch";
import { Filter, Operation, Query } from "../../types/DataTypes";
import { LoggerFactory } from "../../utils/logger";
import { ApiResponse } from "../Api";

const client = algoliasearch(
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

export interface SearchResponse<T> {
  items: T[];
}

const logger = LoggerFactory.getLogger("searchApi");

class SearchApi<T> {
  readonly client: SearchClient;
  readonly indexName: string; // Store indexName instead of index

  constructor(indexName: string) {
    this.client = client;
    this.indexName = indexName; // Store the index name
  }

  async search<T>(query: Query) {
    try {
      const searchOptions = this.toSearchOptions(query);
      logger.debug("options filter", searchOptions.filters);

      // Use the new v5 API: searchSingleIndex with indexName parameter
      const response = await this.client.searchSingleIndex({
        indexName: this.indexName,
        searchParams: {
          query: query.searchText ?? "",
          ...searchOptions,
        },
      });

      return {
        items: response.hits,
        page: {
          index: response.page,
          size: response.hitsPerPage,
          totalPages: response.nbPages,
          totalDocs: response.nbHits,
        },
      } as ApiResponse<T>;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  toSearchOptions(query: Query) {
    const limit = query.limit ?? 100;
    const filters = this.getFilters(query.filters!);
    const coord = query.location?.coordinate;
    const aroundLatLng = coord
      ? coord?.latitude + "," + coord?.longitude
      : undefined;

    const searchOptions: any = {
      hitsPerPage: query.page?.size ?? limit,
      page: query.page?.index ?? 0,
      attributesToHighlight: [],
    };

    // Only add filters if they exist
    if (filters) {
      searchOptions.filters = filters;
    }

    // Only add location params if they exist
    if (aroundLatLng) {
      searchOptions.aroundLatLng = aroundLatLng;
    }
    if (query.location?.aroundRadius) {
      searchOptions.aroundRadius = query.location.aroundRadius;
    }

    return searchOptions;
  }

  getFilters(filters: Filter[]) {
    const filtersString = filters
      ?.filter((f) => {
        if (Array.isArray(f.value)) {
          return f.value?.length > 0;
        }
        return !!f.value && (!!f.field || !!f.name);
      })
      ?.map(this.buildSearchFilter)
      .join(" AND ");
    return filtersString;
  }

  buildSearchFilter(f: Filter) {
    if (f.field.includes(",")) {
      const fields = f.field.split(",");
      if (fields.length === 1) {
        return buildFilterString(fields[0], f.value);
      } else {
        return (
          "(" +
          fields.map((s) => buildFilterString(s, f.value)).join(" OR ") +
          ")"
        );
      }
    } else if (
      f.operation === Operation.IN &&
      Array.isArray(f.value) &&
      f.value.length > 0
    ) {
      return (
        "(" +
        (f.value as any[])
          .map((s) => buildFilterString(f.field, s))
          .join(" OR ") +
        ")"
      );
    } else if ((f.name || f.field) && typeof f.value === "string") {
      const key = f.name ?? f.field;

      return buildFilterString(key, f.value, f.operation);
    } else {
      logger.error("invalid filter data", f);
      // return buildFilterString('1', '1');
    }
  }

  clearCache() {
    return this.client.clearCache();
  }
}

function buildFilterString(
  key: string,
  value: string,
  operation: Operation = Operation.EQUAL
) {
  switch (operation) {
    case Operation.NOT_EQUAL:
      return `(NOT ${key}:'${value}')`;
    default:
      return `${key}:'${value}'`;
  }
}

export default SearchApi;
