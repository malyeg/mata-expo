import { useMemo } from "react";
import { useSearchQuery } from "./useSearchQuery";

// Example usage hook for a specific index with predefined settings
export const useProductSearch = (initialQuery: string = "") => {
  // Memoize initial params to prevent recreation
  const initialParams = useMemo(
    () => ({
      query: initialQuery,
      page: 0,
      hitsPerPage: 20,
      attributesToRetrieve: ["name", "price", "image", "category"],
      attributesToHighlight: ["name", "description"],
    }),
    [initialQuery]
  );

  return useSearchQuery("products", initialParams);
};

// Example usage hook with infinite scroll
export const useProductSearchInfinite = (initialQuery: string = "") => {
  // Memoize initial params and options to prevent recreation
  const initialParams = useMemo(
    () => ({
      query: initialQuery,
      page: 0,
      hitsPerPage: 20,
      attributesToRetrieve: ["name", "price", "image", "category"],
      attributesToHighlight: ["name", "description"],
    }),
    [initialQuery]
  );

  const options = useMemo(
    () => ({
      infiniteScroll: true,
    }),
    []
  );

  return useSearchQuery("products", initialParams, options);
};
