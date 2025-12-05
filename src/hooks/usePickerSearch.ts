import { Entity } from "@/types/DataTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UsePickerSearchOptions<T extends Entity> {
  items: T[];
  debounceMs?: number;
}

interface UsePickerSearchResult<T extends Entity> {
  searchText: string;
  filteredItems: T[];
  setSearchText: (text: string) => void;
  clearSearch: () => void;
}

/**
 * Hook for debounced search with localized name support (Arabic + English)
 */
export const usePickerSearch = <T extends Entity>({
  items,
  debounceMs = 400,
}: UsePickerSearchOptions<T>): UsePickerSearchResult<T> => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle debounced search text updates
  const handleSearchTextChange = useCallback(
    (text: string) => {
      setSearchText(text);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearchText(text);
      }, debounceMs);
    },
    [debounceMs]
  );

  const clearSearch = useCallback(() => {
    setSearchText("");
    setDebouncedSearchText("");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  // Filter items based on debounced search text
  const filteredItems = useMemo(() => {
    const trimmedSearch = debouncedSearchText.trim().toLowerCase();

    if (!trimmedSearch) {
      return items;
    }

    return items.filter((item) => {
      // Check all localized names (supports Arabic and other languages)
      const localizedNames = item.localizedName
        ? Object.values(item.localizedName)
        : [];
      const matchesLocalized = localizedNames.some((name) =>
        name?.toLowerCase().includes(trimmedSearch)
      );

      // Check regular name
      const matchesName = item.name?.toLowerCase().includes(trimmedSearch);

      return matchesLocalized || matchesName;
    });
  }, [items, debouncedSearchText]);

  return {
    searchText,
    filteredItems,
    setSearchText: handleSearchTextChange,
    clearSearch,
  };
};

export default usePickerSearch;

