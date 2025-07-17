import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { Nestable } from "@/types/DataTypes";
import React, { useEffect, useState } from "react";
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

interface PathListProps<T extends Nestable>
  extends Omit<FlatListProps<T>, "renderItem"> {
  data: T[];
  searchText: string;
  keyboardShouldPersistTaps?: boolean;
  onSelect?: (category: T) => void;
}

const SEPARATOR = " » ";
const PathList = <T extends Nestable>({
  searchText,
  data,
  onSelect,
  // keyboardShouldPersistTaps,
  ...props
}: PathListProps<T>) => {
  const [filterdItems, setFilterdItems] = useState<T[]>();

  useEffect(() => {
    if (!!data && !!searchText) {
      const newItems = data.filter(
        (s) =>
          !!s.path?.length &&
          s.path?.length > 2 &&
          s?.path[2].toLowerCase().includes(searchText.toLowerCase())
      );
      const newParentItems = data.filter(
        (s) =>
          !!s.path?.length &&
          s.path?.length === 1 &&
          s?.path[0].toLowerCase().includes(searchText.toLowerCase())
      );
      console.log(newItems?.length, searchText);
      setFilterdItems([...newItems, ...newParentItems]);
      return;
    }
  }, [data, searchText]);

  const renderItem = ({ item }: { item: T }) => {
    return (
      <Pressable
        onPress={onSelect ? () => onSelect(item) : undefined}
        style={styles.itemContainer}
      >
        <Text style={styles.textContainer}>
          {item.path?.map((path, index) => (
            <HightlightText
              key={index}
              text={path}
              textToHightlight={searchText}
              style={styles.pathText}
              ignoreCase
            >
              {index < item.path?.length! - 1 ? (
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
        {item.path?.length! <= 2 && <Chevron style={styles.chevronFirst} />}
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
