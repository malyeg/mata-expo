import { ApiResponse } from "@/api/Api";
import dealsApi, { Deal } from "@/api/dealsApi";
import { Item } from "@/api/itemsApi";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { Operation, QueryBuilder } from "@/types/DataTypes";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Modal, Text } from "../core";
import DataList from "./DataList";
import ItemDealCard from "./ItemDealCard";

interface ItemDealsTabProps {
  item: Item;
  style?: StyleProp<ViewStyle>;
}
const ItemDealsTab = ({ item, style }: ItemDealsTabProps) => {
  const [isVisible, setVisible] = useState(false);
  const router = useRouter();
  const [deals, setDeals] = useState<ApiResponse<Deal> | undefined>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useLocale("widgets");

  useEffect(() => {
    const loadData = async () => {
      try {
        const query = new QueryBuilder<Deal>()
          .filters([
            { field: "item.id", value: item.id },
            {
              field: "status",
              operation: Operation.IN,
              value: ["new", "accepted"],
            },
          ])
          .build();
        const dealsResponse = await dealsApi.getAll(query);
        console.log("dealsResponse");
        if (!!dealsResponse && dealsResponse.length > 0) {
          setDeals(dealsResponse);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [item, user.id]);

  const renderItem = ({ item }) => {
    const onPress = () => {
      setVisible(false);
      router.navigate({
        pathname: "/deals/[id]",
        params: {
          id: item.id,
        },
      });
    };
    return (
      <ItemDealCard
        deal={item}
        style={styles.card}
        imageStyle={styles.cardImage}
        onPress={onPress}
      />
    );
  };

  const closeModal = () => setVisible(false);
  const openModal = () => setVisible(true);
  return deals ? (
    <>
      <View
        style={
          (styles.container,
          { bottom: insets.bottom * -1, paddingBottom: insets.bottom })
        }
      >
        <Pressable onPress={openModal} style={[styles.tabContainer, style]}>
          <View style={styles.dealsCountContainer}>
            <Text style={styles.dealsCountText}>{deals.items.length}</Text>
          </View>
          <Text style={styles.tabText}>You have deals on your item</Text>
          <Icon
            name="chevron-up"
            size={30}
            color={theme.colors.salmon}
            style={styles.chevronIcon}
          />
        </Pressable>
      </View>
      <Modal
        position={deals.items.length > 4 ? "full" : "bottom"}
        isVisible={isVisible}
        containerStyle={styles.modal}
        showHeaderNav={true}
        title={t("itemDealsTab.modalTitle")}
        onClose={closeModal}
      >
        <DataList
          data={deals}
          renderItem={renderItem}
          containerStyle={styles.dataList}
        />
      </Modal>
    </>
  ) : null;
};

export default React.memo(ItemDealsTab);
