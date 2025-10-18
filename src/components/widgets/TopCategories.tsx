import useLocation from "@/hooks/useLocation";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, View, ViewProps } from "react-native";
import categoriesApi from "../../api/categoriesApi";
import theme from "../../styles/theme";
import { Icon, Text } from "../core";
import PressableOpacity from "../core/PressableOpacity";

interface TopCategoriesProps extends ViewProps {}
const categories = categoriesApi
  .getAll()
  .filter((category) => category.level === 0);

const TopCategories = ({ style }: TopCategoriesProps) => {
  const router = useRouter();

  const { location } = useLocation();

  const renderItem = ({ item }) => {
    const onPress = () => {
      router.push({
        pathname: "/items",
        params: {
          categoryId: item.id,
          countryId: location?.country.id,
        },
      });
    };
    return (
      <PressableOpacity
        onPress={onPress}
        key={item.id}
        style={styles.categoryContainer}
      >
        <View
          style={[
            styles.category,
            { backgroundColor: item.icon?.bgColor ?? theme.colors.grey },
          ]}
        >
          <Icon
            name={item.icon?.name ?? "other"}
            // color="white"
            size={35}
            type={item.icon?.type}
          />
        </View>
        <Text style={styles.name}>
          {item.name}
          {/* {item.name} */}
        </Text>
      </PressableOpacity>
    );
  };

  const separatorComponent = () => <View style={styles.separator} />;
  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={separatorComponent}
      />
    </View>
  );
};

export default React.memo(TopCategories);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'grey',
  },
  categoryContainer: {
    alignItems: "center",
  },
  category: {
    // backgroundColor: 'grey',
    width: 80,
    height: 80,
    borderRadius: 40,
    // marginHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        borderColor: theme.colors.lightGrey,
        borderWidth: 2,
        borderBottomWidth: 0,
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOpacity: 1,
        elevation: 3,
      },
    }),
  },
  name: {
    ...theme.styles.scale.body3,
    paddingTop: 7,
    width: 80,
    // flexWrap: 'wrap',
    textAlign: "center",
  },
  separator: {
    width: 35,
  },
});
