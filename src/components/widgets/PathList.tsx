import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { Entity, LocalizedText, Nestable } from "@/types/DataTypes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  FlatListProps,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HightlightText from "../core/HightlightText";
import Chevron from "../icons/Chevron";

interface LocalizedNestable extends Nestable {
  localizedName?: LocalizedText;
  id?: string;
}

interface PathListProps<T extends LocalizedNestable>
  extends Omit<FlatListProps<T>, "renderItem"> {
  data: T[];
  searchText: string;
  keyboardShouldPersistTaps?: boolean;
  onSelect?: (category: T) => void;
}

const SEPARATOR = " » ";
const PathList = <T extends LocalizedNestable>({
  searchText,
  data,
  onSelect,
  // keyboardShouldPersistTaps,
  ...props
}: PathListProps<T>) => {
  const { locale } = useLocale();
  const [filterdItems, setFilterdItems] = useState<T[]>();

  // Build a map of id -> item for quick parent lookup
  const itemMap = useMemo(() => {
    const map = new Map<string, T>();
    data.forEach((item) => {
      if (item.id) {
        map.set(item.id, item);
      }
    });
    return map;
  }, [data]);

  // Build localized path by traversing parent chain
  const getLocalizedPath = useCallback(
    (item: T): string[] => {
      const pathParts: string[] = [];
      let current: T | undefined = item;

      while (current) {
        const localizedName =
          current.localizedName?.[locale] ||
          current.localizedName?.en ||
          (current as Entity).name ||
          "";
        pathParts.unshift(localizedName);
        current = current.parent ? itemMap.get(current.parent) : undefined;
      }

      return pathParts;
    },
    [itemMap, locale]
  );

  // Helper to check if any part of the localized path matches the search text
  const matchesSearch = useCallback(
    (item: T, searchLower: string): boolean => {
      const localizedPath = getLocalizedPath(item);
      // Check both English path and localized path
      const matchesEnglish = item.path?.some((p) =>
        p.toLowerCase().includes(searchLower)
      );
      const matchesLocalized = localizedPath.some((p) =>
        p.toLowerCase().includes(searchLower)
      );
      return matchesEnglish || matchesLocalized;
    },
    [getLocalizedPath]
  );

  useEffect(() => {
    if (!!data && !!searchText) {
      const searchLower = searchText.toLowerCase();
      const newItems = data.filter(
        (s) =>
          !!s.path?.length &&
          s.path?.length > 2 &&
          matchesSearch(s, searchLower)
      );
      const newParentItems = data.filter(
        (s) =>
          !!s.path?.length &&
          s.path?.length === 1 &&
          matchesSearch(s, searchLower)
      );
      console.log(newItems?.length, searchText);
      setFilterdItems([...newItems, ...newParentItems]);
      return;
    }
  }, [data, searchText, matchesSearch]);

  const renderItem = ({ item }: { item: T }) => {
    const localizedPath = getLocalizedPath(item);
    return (
      <Pressable
        onPress={onSelect ? () => onSelect(item) : undefined}
        style={styles.itemContainer}
      >
        <Text style={styles.textContainer}>
          {localizedPath.map((pathSegment, index) => (
            <HightlightText
              key={index}
              text={pathSegment}
              textToHightlight={searchText}
              style={styles.pathText}
              ignoreCase
            >
              {index < localizedPath.length - 1 ? (
                <Text
                  style={[
                    styles.separator,
                    index === 0 ? styles.chevronFirst : undefined,
                  ]}
                >
                  {SEPARATOR}
                </Text>
              ) : undefined}
            </HightlightText>
          ))}
        </Text>
        {localizedPath.length <= 2 && <Chevron style={styles.chevronFirst} />}
      </Pressable>
    );
  };

  const Separator = () => <View style={sharedStyles.separator} />;

  return filterdItems ? (
    <FlatList
      {...props}
      renderItem={renderItem}
      style={styles.list}
      data={filterdItems}
      ItemSeparatorComponent={Separator}
    />
  ) : null;
};

export default PathList;

const styles = StyleSheet.create({
  list: {},
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 61,
  },
  textContainer: {},
  pathText: {},
  rightChevron: {
    paddingBottom: 0,
    fontSize: 25,
  },
  separator: {
    fontSize: 25,
  },

  chevronFirst: {
    color: theme.colors.green,
  },
});
