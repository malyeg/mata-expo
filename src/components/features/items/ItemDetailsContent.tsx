import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ApiResponse } from "@/api/Api";
import dealsApi, { Deal } from "@/api/dealsApi";
import { conditionList, Item, swapTypes } from "@/api/itemsApi";
import { Button, Icon, Loader, Modal, Screen, Text } from "@/components/core";
import PressableOpacity from "@/components/core/PressableOpacity";
import ItemDealsTab from "@/components/widgets/ItemDealsTab";
import ItemDetailsCard from "@/components/widgets/ItemDetailsCard";
import ItemPicker from "@/components/widgets/ItemPicker";
import OwnerItems from "@/components/widgets/OwnerItems";
import Sheet from "@/components/widgets/Sheet";
import SwapButton from "@/components/widgets/SwapButton";
import TextDescription from "@/components/widgets/TextDescription";
import useApi from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";

import categoriesApi from "@/api/categoriesApi";
import GuestModal from "@/components/modals/GuestModal";
import ItemImagesCarousel from "@/components/widgets/ItemImagesCarousel";
import useSheet from "@/hooks/useSheet";
import useToast from "@/hooks/useToast";
import { theme } from "@/styles/theme";
import { timeAgo } from "@/utils/DateUtils";
import { useRouter } from "expo-router";
import InactiveItemModal from "./InactiveItemModal";
import ItemAd from "./ItemAd";

interface ItemDetailsContentProps {
  item: Item | undefined;
  loading?: boolean;
  wishItemId: string | undefined;
  isArchivedModalVisible: boolean;
  isBlockedModalVisible: boolean;
  setArchivedModalVisible: (visible: boolean) => void;
  setBlockedModalVisible: (visible: boolean) => void;
  toggleWishList: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItem: React.MutableRefObject<boolean>;
}

const ItemDetailsContent = ({
  item,
  loading = false,
  wishItemId,
  isArchivedModalVisible,
  isBlockedModalVisible,
  setArchivedModalVisible,
  setBlockedModalVisible,
  toggleWishList,
  deleteItem,
  refreshItem,
}: ItemDetailsContentProps) => {
  const router = useRouter();
  const [showItemPicker, setShowItemPicker] = useState(false);

  const { request, loader } = useApi();
  const { user, getName } = useAuth();
  const { t, locale } = useLocale("itemDetailsScreen");
  const { show, sheetRef } = useSheet();
  const { showErrorToast, showToast } = useToast();
  const [isGuestModalVisible, setGuestModalVIsible] = useState(false);

  const swapHandler = useCallback(async () => {
    if (!user || !item) return;
    try {
      if (user.isAnonymous) {
        setGuestModalVIsible(true);
        return;
      }
      const itemHasDeals = await request<ApiResponse<Deal>>(() =>
        dealsApi.itemHasDeals(user.id, item!)
      );
      if (itemHasDeals) {
        showToast({
          message: t("alreadyHasDealError"),
          type: "error",
          options: {
            duration: 5000,
            autoHide: true,
          },
        });
        return;
      }
    } catch (error) {
      showErrorToast(error);
    }
    if (item?.swapOption.type === "free") {
      show({
        header: t("swapHeader"),
        body: t("swapBody", { params: { item: item.name } }),
        confirmTitle: t("swapConfirmTitle"),
        confirmCallback: async () => {
          try {
            const offer = await request<Deal>(() =>
              dealsApi.createOffer(
                {
                  id: user.id,
                  email: user.email,
                  name: getName(),
                  displayName: getName(),
                },
                item!
              )
            );
            refreshItem.current = true;
            router.navigate({
              pathname: "/deals/[id]",
              params: {
                id: offer.id,
                toastType: "newOffer",
              },
            });
          } catch {}
        },
      });
    } else {
      setShowItemPicker(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, user?.id]);

  const onItemPicker = (swapItem: Item) => {
    if (!user || !item) return;
    setShowItemPicker(false);
    show({
      header: t("swapHeader"),
      body: t("swapCategoryBody", {
        params: { source: item?.name!, destination: swapItem.name },
      }),
      confirmCallback: async () => {
        try {
          const offer = await request<Deal>(() =>
            dealsApi.createOffer(
              {
                id: user.id,
                email: user.email,
                name: getName(),
                displayName: getName(),
              },
              item!,
              swapItem
            )
          );
          refreshItem.current = true;
          router.navigate({
            pathname: "/deals/[id]",
            params: {
              id: offer.id,
              toastType: "newOffer",
            },
          });
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const conditionName = conditionList.find(
    (i) => i.id === item?.condition?.type
  )?.name;

  const handleToggleWishList = async () => {
    if (!user) return;
    if (user?.isAnonymous) {
      setGuestModalVIsible(true);
      return;
    }
    await toggleWishList();
  };

  const categoryName = useMemo(() => {
    if (item && item.category.path && item.category.path.length > 0) {
      const category = categoriesApi.getById(item.category.id).localizedName?.[
        locale
      ];
      if (item.category.path && item.category.path.length === 1) {
        return category;
      } else {
        const allCategories = categoriesApi.getAll();
        const localizedPath = item.category.path
          ?.slice(0, -1)
          .map((name) => {
            const cat = allCategories.find((c) => c.name === name);
            return cat?.localizedName?.[locale] || name;
          })
          .join(" / ");
        return (
          <Text>
            {localizedPath}
            {" / "}
            <Text style={styles.lastCategoryName}>{category}</Text>
          </Text>
        );
      }
    }
  }, [item, locale]);

  const showSwapButton =
    item?.userId !== user?.id && !item?.archived && item?.status === "online";

  const showItemDealsTab =
    item?.userId === user?.id && !item?.archived && item?.status !== "archived";

  const showWishIcon =
    user?.id !== item?.userId &&
    wishItemId !== undefined &&
    !item?.archived &&
    item?.status === "online";

  const hideItemPicker = () => setShowItemPicker(false);

  const timeAgoString = useMemo(() => {
    if (item?.timestamp) {
      return timeAgo(item?.timestamp);
    }
  }, [item?.timestamp]);

  const showSimilarItems = () => {
    setArchivedModalVisible(false);
    // TODO: Navigate to items list with category filter
  };

  const goBack = () => {
    setArchivedModalVisible(false);
    router.back();
  };

  const closeBlockedModal = () => {
    setBlockedModalVisible(false);
  };
  const closeArchivedModal = () => {
    setArchivedModalVisible(false);
  };

  const closeGuestModal = () => {
    setGuestModalVIsible(false);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  return item ? (
    <>
      <Screen scrollable={true} style={styles.screen}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          {item.userId !== user.id && (
            <SwapButton
              onPress={item.status === "online" ? swapHandler : undefined}
              item={item}
              iconSize={20}
            />
          )}
        </View>
        {!!item.description && (
          <TextDescription textStyle={styles.descriptionText}>
            {item.description}
          </TextDescription>
        )}

        <View>
          <ItemImagesCarousel item={item} />
          {showWishIcon && (
            <PressableOpacity
              hitSlop={5}
              onPress={handleToggleWishList}
              style={styles.wishListIcon}
            >
              <Icon
                name={wishItemId ? "heart" : "heart-outline"}
                size={30}
                color={theme.colors.salmon}
              />
            </PressableOpacity>
          )}
        </View>
        {timeAgoString && (
          <View style={styles.sinceContainer}>
            <Text>{t("sinceLabel", { params: { time: timeAgoString } })}</Text>
          </View>
        )}

        {item.userId !== user.id && (
          <ItemDetailsCard
            title={t("ownerTitle")}
            content={item?.user?.name ?? item.user?.email ?? t("guestLabel")}
            icon="account-outline"
            onPress={() =>
              router.navigate({
                pathname: "/users/[id]",
                params: { id: item?.userId },
              })
            }
          />
        )}
        <ItemDetailsCard
          title={t("categoryTitle")}
          content={categoryName!}
          icon="category"
          iconType="custom"
          onPress={() =>
            router.navigate({
              pathname: "/items",
              params: { categoryId: item.category.id.toString() },
            })
          }
        />
        {item.userId === user.id && (
          <ItemDetailsCard
            title={t("statusTitle")}
            content={item.status}
            icon="cast-connected"
            contentStyle={item.status === "online" ? styles.greenText : {}}
          />
        )}

        <ItemDetailsCard
          title={t("itemConditionTitle")}
          content={conditionName ?? item.condition?.type}
          icon="note-text-outline"
          contentStyle={(styles as any)[item.condition?.type]}
        >
          {!!item.condition?.desc && (
            <Text style={styles.conditionDesc}>{item.condition?.desc}</Text>
          )}
        </ItemDetailsCard>

        <ItemDetailsCard
          title={
            item.swapOption.type === "swapWithAnother"
              ? t("swapCategoryTitle")
              : t("swapTypeTitle")
          }
          content={
            item.swapOption.type === "swapWithAnother"
              ? (item.swapOption?.category as any)?.name ??
                item.swapOption.category
              : swapTypes.find((type) => type.id === item.swapOption.type)
                  ?.name ?? item.swapOption.type
          }
          icon="handshake"
          contentStyle={(styles as any)[item.swapOption.type]}
        />
        <ItemDetailsCard
          title={t("addressTitle")}
          content={
            (item.location?.state?.name ?? item.location?.city?.name) +
            ", " +
            item.location?.country?.name
          }
          icon="google-maps"
        />

        <ItemAd style={styles.banner} />

        {!!item && item.userId !== user.id && (
          <OwnerItems item={item} style={styles.ownerItems} />
        )}

        <Sheet ref={sheetRef} />
        {showItemPicker && (
          <ItemPicker
            title={t("itemPickerTitle")}
            isVisible={showItemPicker}
            categoryId={
              (item.swapOption.category as any)?.id ?? item.swapOption.category
            }
            onClose={hideItemPicker}
            onChange={onItemPicker}
          />
        )}
        <Modal
          isVisible={isArchivedModalVisible}
          title={t("archivedDialog.header")}
          onClose={closeArchivedModal}
        >
          <Text>{t("archivedDialog.body")}</Text>
          <View style={styles.archivedButtonsContainer}>
            <Button
              title={t("archivedDialog.cancelBtn")}
              style={styles.archivedButton}
              themeType="white"
              onPress={goBack}
            />
            <Button
              title={t("archivedDialog.showBtn")}
              style={styles.archivedButton}
              onPress={showSimilarItems}
            />
          </View>
        </Modal>
        <Modal
          isVisible={isBlockedModalVisible}
          title={t("blockedDialog.header")}
          onClose={closeBlockedModal}
        >
          <Text style={styles.blockedModalText}>{t("blockedDialog.body")}</Text>
        </Modal>
        <InactiveItemModal item={item} />
      </Screen>
      {showSwapButton && (
        <Button
          title={t("sendSwapButton")}
          onPress={swapHandler}
          style={styles.sendSwapButton}
        />
      )}
      {showItemDealsTab && <ItemDealsTab item={item} />}
      <GuestModal isVisible={isGuestModalVisible} onCancel={closeGuestModal} />
      {loader}
    </>
  ) : (
    <Loader />
  );
};

export { ItemDetailsContent };

const styles = StyleSheet.create({
  screen: {
    marginTop: 10,
    paddingBottom: 50,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  nameText: {
    color: theme.colors.salmon,
    ...theme.styles.scale.h6,
  },
  descriptionText: {
    marginBottom: 10,
    textAlign: "justify",
  },
  greenText: {
    color: theme.colors.green,
  },
  banner: {
    marginTop: 10,
  },
  carousel: {
    height: 200,
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    height: 200,
    maxHeight: 200,
    borderRadius: 20,
    marginBottom: 10,
  },
  activityContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  statusContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  descriptionContainer: {
    flexDirection: "row",
  },
  rowTitle: {
    color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
  },
  conditionTitle: {},
  conditionColumn: {
    flexShrink: 1,
  },
  status: {
    color: theme.colors.grey,
    fontWeight: theme.fontWeight.semiBold,
  },
  conditionDesc: {
    color: theme.colors.grey,
    ...theme.styles.scale.body2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  location: {
    height: 150,
    marginBottom: 10,
  },
  addressContainer: {},
  ownerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  ownerIcon: {
    marginLeft: -5,
  },
  confirmText: {
    ...theme.styles.scale.h6,
  },
  freeImage: {
    position: "absolute",
    top: -5,
    left: 10,
    width: 70,
    height: 70,
    transform: [{ rotate: "-10deg" }],
  },
  wishListIcon: {
    position: "absolute",
    bottom: 12,
    right: 10,
    zIndex: 1,
    elevation: 5,
  },
  swapContainer: {
    height: 60,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: theme.colors.salmon,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  swapButton: {
    color: theme.colors.white,
    ...theme.styles.scale.h6,
  },
  ownerItems: {
    marginTop: 20,
  },
  used: {
    color: theme.colors.orange,
  },
  free: {
    color: theme.colors.green,
  },
  sendSwapButton: {
    marginHorizontal: 20,
  },
  lastCategoryName: {
    fontWeight: theme.fontWeight.bold,
  },
  sinceContainer: {
    marginVertical: 5,
    alignItems: "flex-end",
  },
  archivedButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  archivedButton: {
    flexBasis: "48%",
  },
  blockedModalText: {
    paddingVertical: 20,
  },
});
