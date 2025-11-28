import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Icon, Text } from "../core";

interface ItemsSearchProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const ItemsSearch = ({ onPress }: ItemsSearchProps) => {
  const { t } = useLocale("widgets");

  return (
    <>
      <Pressable style={styles.searchContainer} onPress={onPress}>
        <Icon
          style={styles.homeSearchIcon}
          name="magnify"
          color={theme.colors.grey}
          size={25}
        />
        <Text>{t("itemsSearch.placeholder")}</Text>
      </Pressable>
    </>
  );
};

export default React.memo(ItemsSearch);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    alignItems: "center",
    borderRadius: 7,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 10,
  },
  text: {
    flex: 1,
    ...theme.styles.scale.body1,
    color: theme.colors.dark,
    // backgroundColor: 'blue',
  },
  homeSearchIcon: {
    paddingRight: 5,
  },
  modalSearchIcon: {
    paddingRight: 5,
  },
  itemsList: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    flexBasis: "48%",
  },
});
