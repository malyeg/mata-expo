import { ApiResponse } from "@/api/Api";
import categoriesApi from "@/api/categoriesApi";
import itemsApi, { Item, ItemStatus } from "@/api/itemsApi";
import { screens } from "@/config/constants";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";
import { QueryBuilder } from "@/types/DataTypes";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Loader, Modal, Text } from "../core";
import DataList from "./DataList";
import ItemCard from "./ItemCard";
import NoDataFound from "./NoDataFound";

interface ItemPickerProps {
  isVisible: boolean;
  categoryId?: string;
  onClose?: () => void;
  onChange: (item: Item) => void;
  title?: string;
}
const ItemPicker = ({
  isVisible,
  categoryId,
  onChange,
  onClose,
  title,
}: ItemPickerProps) => {
  const [items, setItems] = useState<ApiResponse<Item>>();
  const { user } = useAuth();
  const { t } = useLocale("widgets");
  useEffect(() => {
    const query = new QueryBuilder<Item>().filters([
      { field: "userId", value: user?.id },
      { field: "status", value: "online" as ItemStatus },
    ]);
    !!categoryId && query.filter("category.id", categoryId);
    itemsApi.getAll(query.build()).then((itemResp) => {
      console.log("itemResp", itemResp.length);
      if (itemResp && itemResp.length > 0) {
        setItems({ items: itemResp });
      } else {
        setItems({ items: [] });
      }
    });
  }, [categoryId, user?.id]);

  const renderItem = ({ item }) => (
    <ItemCard item={item} style={styles.card} onPress={onChange} />
  );
  const EmptyComponent = (
    <NoDataFound title="">
      <Text style={styles.noDataTitle}>{t("itemPicker.noCategoryTitle")}</Text>
      <Text style={styles.emptyBodyText}>
        {categoryId
          ? t("itemPicker.noDataNoCategory", {
              params: {
                categoryName: categoriesApi.getById(categoryId!)?.name!,
              },
            })
          : t("itemPicker.noData")}
      </Text>
      <Link
        onPress={onClose}
        style={sharedStyles.link}
        href={{
          screen: screens.ADD_ITEM,
          params: {
            categoryId: categoryId,
          },
        }}
      >
        <Text style={styles.addLink}>
          {t("itemPicker.noCategoryLinkTitle")}
        </Text>
      </Link>
    </NoDataFound>
  );

  return (
    <Modal
      isVisible={isVisible}
      showHeaderNav={true}
      title={title ?? t("itemDetailsScreen:itemPickerTitle")}
      position="full"
      onClose={onClose}
    >
      {items ? (
        <DataList
          data={items}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
          ListEmptyComponent={EmptyComponent}
        />
      ) : (
        <Loader />
      )}
    </Modal>
  );
};

export default React.memo(ItemPicker);

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    flexBasis: "48%",
  },
  noDataFound: {
    flex: 1,
    backgroundColor: "grey",
    height: 500,
  },
  datalist: { flex: 1 },
  emptyBodyText: {
    alignItems: "center",
    textAlign: "center",
  },
  noDataTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
  },
  addLink: {
    ...theme.styles.scale.h6,
    color: theme.colors.green,
    textDecorationLine: "underline",
  },
});
