import { ApiResponse } from "@/api/Api";
import dealsApi, { Deal } from "@/api/dealsApi";
import { Item } from "@/api/itemsApi";
import { screens } from "@/config/constants";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { Operation, QueryBuilder } from "@/types/DataTypes";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
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
      navigation.navigate(screens.DEAL_DETAILS, {
        id: item.id,
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

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: 75,
    backgroundColor: theme.colors.white,
    // paddingBottom: 80,
  },
  dataList: {
    flex: 0,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    ...Platform.select({
      ios: {
        // shadowRadius: 1,
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        borderColor: theme.colors.lightGrey,
        borderWidth: 2,
        borderBottomWidth: 0,
        paddingBottom: 10,
      },
      android: {
        elevation: 2,
      },
    }),
    padding: 20,
  },
  chevronIcon: {
    position: "absolute",
    right: 20,
  },
  modal: {
    // flex: 1,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalBody: {},
  card: {
    marginBottom: 2,
  },
  cardImage: {},
  viewMoreContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    color: theme.colors.salmon,
  },
  dealsCountContainer: {
    position: "absolute",
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.salmon,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  dealsCountText: {
    color: theme.colors.white,
  },
});
