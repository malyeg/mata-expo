import { Item } from "@/api/itemsApi";
import theme from "@/styles/theme";
import Analytics from "@/utils/Analytics";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { Icon, Image, Text } from "../core";
import SwapIcon from "./SwapIcon";

const CARD_BORDER = 2;
const CARD_HEIGHT = 130;
export const MAP_CARD_HEIGHT = CARD_HEIGHT + CARD_BORDER;
export const MAP_CARD_WIDTH = Dimensions.get("window").width * 0.85;
interface ItemCardProps extends ViewProps {
  item: Item;
  showActivityStatus?: boolean;
  onSwap?: (item: Item) => void;
  showSwapIcon?: boolean;
  onPress?: (item: Item) => void;
  sourceList?: string;
}
const MapItemCard = ({ item, style, onPress, sourceList }: ItemCardProps) => {
  const router = useRouter();

  const openItemDetails = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
    router.navigate({
      pathname: "/items/[id]",
      params: { id: item.id },
    });
    Analytics.logSelectItem(item, sourceList);
  }, [item, router, onPress, sourceList]);

  const itemImage = item?.images ? item?.images[0] : undefined;
  const imageUrl = item.defaultImageURL ?? itemImage?.downloadURL;

  const categoryName =
    item.category?.name.toLowerCase() === "other" &&
    item.category?.path?.length &&
    item.category?.path?.length > 1
      ? item.category?.path[item.category?.path?.length - 2]
      : item.category?.name;
  return (
    <Pressable style={[styles.card, style]} onPress={openItemDetails}>
      <Image uri={imageUrl!} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text numberOfLines={1} style={styles.nameText}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.nameText}>
          {categoryName}
        </Text>
      </View>
      <View style={styles.iconsContainer}>
        {item?.swapOption?.type === "free" && (
          <Icon
            size={40}
            color={theme.colors.salmon}
            style={styles.freeImage}
            name="free"
            type="custom"
          />
        )}
        <SwapIcon item={item} />
      </View>
    </Pressable>
  );
};

export default React.memo(MapItemCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderColor: theme.colors.salmon,
    borderWidth: CARD_BORDER,
    width: MAP_CARD_WIDTH,
    // marginLeft: 20,
    height: CARD_HEIGHT,
    paddingHorizontal: 5,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    paddingVertical: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  iconsContainer: {
    // flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  image: {
    width: 120,
    marginVertical: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  nameText: {
    ...theme.styles.scale.body2,
    fontWeight: theme.fontWeight.semiBold,
    paddingBottom: 3,
  },
  freeImage: {
    // marginRight: 'auto',
    width: 35,
    height: 35,
    // transform: [{rotate: '10deg'}],
  },
});
