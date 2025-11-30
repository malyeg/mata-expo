import categoriesApi from "@/api/categoriesApi";
import { Item } from "@/api/itemsApi";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import Analytics from "@/utils/Analytics";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { Icon, Image, Text } from "../core";
import SwapIcon from "./SwapIcon";

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
export const ITEM_CARD_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface ItemCardProps extends ViewProps {
  item: Item;
  showActivityStatus?: boolean;
  onSwap?: (item: Item) => void;
  showSwapIcon?: boolean;
  onPress?: (item: Item) => void;
  sourceList?: string;
}
const ItemCard = ({
  item,
  style,
  showActivityStatus,
  onPress,
  sourceList,
  showSwapIcon = false,
}: ItemCardProps) => {
  const router = useRouter();
  const { t, locale } = useLocale("addItemScreen");

  const getStatusLabel = (status: string) => {
    if (status === "online") return t("status.online");
    if (status === "draft") return t("status.draft");
    return status;
  };

  const category = //TODO: get category name from item.category.localizedName if doesn't exists get category from categories.js and use it's name localizedName
    item.category?.localizedName?.[locale] ??
    categoriesApi.getById(item.category?.id)?.localizedName?.[locale];

  const openItemDetails = useCallback(() => {
    if (onPress) {
      onPress(item);
    } else {
      router.push({
        pathname: "/(main)/(tabs)/(home)/item/[id]",
        params: { id: item.id },
      });
    }
    Analytics.logSelectItem(item, sourceList);
    // linkTo('/items/' + item.id);
  }, [item, onPress, router, sourceList]);

  const imageUrl = item.defaultImageURL ?? item?.images?.[0]?.downloadURL;
  const categoryName = category ?? item.category?.name;
  // item.category?.name.toLowerCase() === "other" &&
  // item.category?.path?.length &&
  // item.category?.path?.length > 1
  //   ? item.category?.path[item.category?.path?.length - 2]
  //   : item.category?.name;

  return (
    <Pressable style={[styles.card, style]} onPress={openItemDetails}>
      <View style={styles.cardHeader}>
        {(item?.swapOption?.type === "free" ||
          item?.swapOptionType === "free") && (
          <Icon
            size={30}
            color={theme.colors.salmon}
            style={styles.freeImage}
            name="free"
            type="custom"
          />
        )}
        {showSwapIcon && <SwapIcon item={item} />}
        {showActivityStatus && (
          <View
            style={[
              styles.activityStatusContainer,
              item.status === "online" ? styles.onlineBackgroundColor : {},
            ]}
          >
            <Text style={[styles.activityStatusText]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        )}
      </View>

      <Image uri={imageUrl!} style={styles.image} />

      <Text numberOfLines={1} style={styles.nameText}>
        {item.name}
      </Text>
      <View style={styles.cardCategory}>
        <Text style={styles.categoryText} numberOfLines={1}>
          {categoryName}
        </Text>
      </View>
    </Pressable>
  );
};

export default React.memo(ItemCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: CARD_BORDER,
    width: 150,
    height: CARD_HEIGHT,
    paddingHorizontal: 5,
    backgroundColor: theme.colors.white,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 2,
    height: 30,
  },
  activityStatusContainer: {
    width: 60,
    height: 25,
    borderTopLeftRadius: 11.5,
    borderBottomLeftRadius: 11.5,
    backgroundColor: theme.colors.dark,
    justifyContent: "center",
    alignItems: "center",
  },
  activityStatusText: {
    color: theme.colors.white,
    ...theme.styles.scale.body3,
  },
  onlineBackgroundColor: {
    backgroundColor: theme.colors.green,
  },
  image: {
    flex: 1,
    marginBottom: 5,
    borderRadius: 10,
  },
  cardCategory: {
    justifyContent: "center",
    borderTopColor: theme.colors.lightGrey,
    borderTopWidth: 2,
    paddingVertical: 3,
  },
  categoryText: {
    ...theme.styles.scale.body2,
    // flex: 1,
  },
  nameText: {
    ...theme.styles.scale.body2,
    fontWeight: theme.fontWeight.semiBold,
    paddingBottom: 3,
  },
  freeImage: {
    marginRight: "auto",
    width: 35,
    height: 35,
    transform: [{ rotate: "-10deg" }],
  },
});
