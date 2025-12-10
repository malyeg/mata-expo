import dealsApi, { Deal, DealRating } from "@/api/dealsApi";
import itemsApi from "@/api/itemsApi";
import { RatingWeight } from "@/api/ratingApi";
import { Button, Image, Loader, Screen, Text } from "@/components/core";
import Card from "@/components/core/Card";
import DateText from "@/components/core/DateText";
import { KeyboardView } from "@/components/form";
import SwapIcon from "@/components/icons/SwapIcon";
import AcceptOfferModal from "@/components/widgets/AcceptOfferModal";
import Chat from "@/components/widgets/Chat";
import DealStatus from "@/components/widgets/DealStatus";
import { MenuItem } from "@/components/widgets/Header";
import Sheet from "@/components/widgets/Sheet";
import constants from "@/config/constants";
import useApi from "@/hooks/useApi";
import useAppReview from "@/hooks/useAppReview";
import useAuth from "@/hooks/useAuth";
import useLocale from "@/hooks/useLocale";
import useRating from "@/hooks/useRating";
import useSheet from "@/hooks/useSheet";
import useToast from "@/hooks/useToast";
import sharedStyles from "@/styles/SharedStyles";
import { theme } from "@/styles/theme";
import { differenceInDays } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const swapImageSize = 150;
const imageSize = 80;

const DealDetailsScreen = () => {
  const { id: dealId } = useLocalSearchParams<{
    id: string;
  }>();

  const [isAcceptModalVisible, setAcceptModalVisible] = useState(false);
  const { request, loader } = useApi();
  const router = useRouter();
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal>();
  const { t } = useLocale("dealDetailsScreen");
  const { show, sheetRef } = useSheet();
  const { showSuccessToast, showErrorToast } = useToast();
  const {
    RatingView,
    ratingViewProps,
    RatingModal,
    ratingModalProps,
    setDefaultValue,
    openRatingModal,
  } = useRating();

  const { requestInAppReview } = useAppReview();

  const title =
    user.id === deal?.userId ? t("outgoingDealTitle") : t("incomingDealTitle");
  useEffect(() => {
    const loadData = (d: Deal) => {
      if (!d) {
        router.navigate("/deals");
        return;
      }

      setDeal(d);
      if (d.rating) {
        const ratedUserId = Object.keys(d.rating).find(
          (key) => key !== user.id
        );
        if (ratedUserId && d.rating[ratedUserId]) {
          setDefaultValue(d.rating[ratedUserId].rate);
        }
      }
      let menuItems: MenuItem[] = [];
      const title =
        user.id === d.userId ? t("outgoingDealTitle") : t("incomingDealTitle");
      if (d.status === "accepted") {
        menuItems = [
          {
            label: t("menu.cancelLabel"),
            icon: { name: "close-circle-outline", color: theme.colors.dark },
            onPress: () => {
              show({
                header: t("cancelOfferConfirmationHeader"),
                body: t("cancelOfferConfirmationBody"),
                confirmCallback: () => cancelHandler(d),
              });
            },
          },
        ];
      } else if (d.status === "new") {
        if (d.userId !== user.id) {
          menuItems = [
            {
              label: t("menu.rejectLabel"),
              icon: { name: "close-circle-outline", color: theme.colors.dark },
              onPress: () => {
                show({
                  header: t("rejectOfferConfirmationHeader"),
                  body: t("rejectOfferConfirmationBody"),
                  confirmCallback: () => rejectHandler(d),
                });
              },
            },
          ];
        } else {
          menuItems = [
            {
              label: t("menu.cancelLabel"),
              icon: { name: "close-circle-outline", color: theme.colors.dark },
              onPress: () => {
                show({
                  header: t("cancelOfferConfirmationHeader"),
                  body: t("cancelOfferConfirmationBody"),
                  confirmCallback: () => cancelHandler(d),
                });
              },
            },
          ];
        }
      }
      // TODO set header menu
      // (navigation as any).setOptions({
      //   header: (props: any) => (
      //     <Header {...props} title={title} menu={{ items: menuItems }} />
      //   ),
      // });
    };

    return dealsApi.onDocumentSnapshot(
      dealId!,
      (snapshot) => {
        const closeTimestamp = (snapshot as any).closeTimestamp;
        const timestamp = (snapshot as any).timestamp;
        if (snapshot && closeTimestamp) {
          snapshot.closeDate = closeTimestamp.toDate();
        }
        if (snapshot && timestamp && timestamp.toDate) {
          snapshot.timestamp = timestamp.toDate();
        }
        loadData(snapshot as Deal);
      },
      (error) => console.error(error)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptHandler = async (rejectOtherOffers: boolean) => {
    try {
      await request(() => dealsApi.acceptOffer(deal?.id!, rejectOtherOffers));
      setDeal({ ...deal!, status: "accepted" });
    } catch (error) {
      showErrorToast(error);
    }
  };
  const onStartDeal = async () => {
    if (deal?.item?.id) {
      const otherOffers = await dealsApi.getOffers(deal?.item?.id);
      if (otherOffers && otherOffers.length > 1) {
        setAcceptModalVisible(true);
      } else {
        acceptHandler(false);
      }
    }
  };

  const closeAcceptOfferModal = () => {
    setAcceptModalVisible(false);
  };

  const cancelHandler = async (d: Deal) => {
    try {
      await request(() => dealsApi.cancelOffer(d));
      router.navigate("/deals");
    } catch (error) {
      showErrorToast(error);
    }
  };
  const rejectHandler = useCallback(
    async (d?: Deal) => {
      try {
        await request(() => dealsApi.rejectOffer(d ?? deal!, "other"));
        router.navigate("/deals");
      } catch (error) {
        // console.error(error);
        showErrorToast(error);
      }
    },
    [deal, router, request, showErrorToast]
  );

  const onReject = useCallback(() => {
    show({
      header: t("rejectOfferConfirmationHeader"),
      body: t("rejectOfferConfirmationBody"),
      confirmCallback: rejectHandler,
    });
  }, [rejectHandler, show, t]);

  const onRatingChange = useCallback(
    (ratingWeight: RatingWeight, comments = "") => {
      if (deal) {
        const dealRating: DealRating = { rate: ratingWeight, comments };
        const ratedUserId =
          deal.userId === user.id ? deal.item.userId : deal.userId;
        request(() => dealsApi.rateDeal(deal, ratedUserId, dealRating));
      }
    },
    [deal, request, user.id]
  );

  const closeDealHandler = async () => {
    try {
      show({
        header: t("confirmCloseDealHeader"),
        body: t("confirmCloseDealBody"),
        children: <Text>{t("confirmCloseDealContent")}</Text>,
        confirmCallback: async () => {
          await request(() => dealsApi.closeOffer(deal!));
          openRatingModal({
            rateDealHandler: () => {
              router.back();
              showSuccessToast(t("closeDeal.success"));
              requestInAppReview();
            },
          });
        },
      });
    } catch (error) {
      showErrorToast(error);
    }
  };
  const rateDealHandler = async () => {
    try {
      openRatingModal({
        rateDealHandler: () => {
          // navigation.goBack();
          // showSuccessToast(t('closeDeal.success'));
        },
      });
    } catch (error) {
      showErrorToast(error);
    }
  };

  const onSwapItemPress = useCallback(() => {
    router.navigate({
      pathname: "/items/[id]",
      params: { id: deal?.swapItem?.id! },
    });
  }, [deal, router]);

  const onItemPress = useCallback(() => {
    router.navigate({
      pathname: "/items/[id]",
      params: { id: deal?.item?.id! },
    });
  }, [deal, router]);

  const imageUrl = deal?.item ? itemsApi.getImageUrl(deal?.item) : undefined;
  const swapImageUrl = deal?.swapItem
    ? itemsApi.getImageUrl(deal.swapItem)
    : undefined;

  const chatDisabled = useMemo(() => {
    if (deal?.status === "canceled" || deal?.status === "rejected") {
      return true;
    } else if (deal?.status === "closed") {
      const closeDate = deal?.closeDate ?? new Date();
      const closeDiffInDays = differenceInDays(Date.now(), closeDate);
      if (closeDiffInDays > constants.deals.CLOSE_CHAT_AFTER_DAYS) {
        return true;
      }
    }
    return false;
  }, [deal]);

  const dealRated = useMemo(() => {
    const ratedUserId =
      deal?.userId === user.id ? deal?.item.userId : deal?.userId;
    if (ratedUserId) {
      return !!deal?.rating && deal?.rating[ratedUserId];
    }
    return false;
  }, [deal?.item.userId, deal?.rating, deal?.userId, user.id]);

  return deal ? (
    <Screen style={styles.screen}>
      <Stack.Screen
        options={{
          title,
        }}
      />
      <KeyboardView>
        <Card style={styles.card} contentStyle={sharedStyles.centerRow}>
          <DealStatus deal={deal} style={styles.statusText} />
          <DateText date={deal.timestamp!} style={styles.dealDateText} />
          <Pressable style={styles.imageContainer} onPress={onItemPress}>
            <Image
              uri={imageUrl}
              style={
                deal.item.swapOption.type !== "free"
                  ? styles.image
                  : styles.swapImage
              }
            />
          </Pressable>
          {deal.item.swapOption.type !== "free" && deal.swapItem && (
            <>
              <SwapIcon style={styles.swapIcon} size={40} />
              <Pressable
                style={styles.swapImageContainer}
                onPress={onSwapItemPress}
              >
                <Image
                  uri={swapImageUrl}
                  style={styles.swapImage}
                  cotentFit="cover"
                />
              </Pressable>
            </>
          )}
        </Card>
        {dealRated && <RatingView {...ratingViewProps} disabled={true} />}
      </KeyboardView>

      {deal.userId !== user.id && deal.status === "new" && (
        <View style={styles.actionButtonsContainer}>
          <Button
            title={t("approveBtnTitle")}
            onPress={onStartDeal}
            style={[styles.acceptButton, styles.actionButton]}
          />
          <Button
            title={t("rejectBtnTitle")}
            onPress={onReject}
            themeType="dark"
            style={styles.actionButton}
          />
        </View>
      )}

      <Text style={styles.chatHeaderText}>
        {t("chatHeader", {
          params: {
            userName:
              user.id === deal.userId ? deal.item?.user?.name : deal.user?.name,
          },
        })}
      </Text>
      <Chat deal={deal} disableComposer={chatDisabled} style={styles.chat} />

      {deal?.status === "accepted" && deal.userId !== user.id && (
        <Button title={t("closeBtnTitle")} onPress={closeDealHandler} />
      )}
      {deal?.status === "closed" && !dealRated && (
        <Button title={t("rateBtnTitle")} onPress={rateDealHandler} />
      )}
      {loader}
      <Sheet ref={sheetRef} />
      <RatingModal {...ratingModalProps} onRatingChange={onRatingChange} />
      <AcceptOfferModal
        isVisible={isAcceptModalVisible}
        onClose={closeAcceptOfferModal}
        onAccept={acceptHandler}
      />
    </Screen>
  ) : (
    <Loader />
  );
};

export default DealDetailsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10,
  },
  chat: {
    marginBottom: 10,
  },
  card: {
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  chatHeaderText: {
    textAlign: "center",
    marginBottom: 10,
    ...theme.styles.scale.h6,
  },
  header: {
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: -20,
  },
  categoryName: {
    color: theme.colors.grey,
  },
  typeContainer: {
    flexDirection: "row",
  },
  actionContainer: {
    // flex: 1,
    flexDirection: "row",
    marginVertical: 10,
  },

  swapIcon: {
    marginHorizontal: -10,
    zIndex: 1000,
  },
  swapImageContainer: {},
  imageContainer: {},
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    backgroundColor: theme.colors.lightGrey,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
  },
  swapImage: {
    width: swapImageSize,
    height: swapImageSize,
    borderRadius: swapImageSize / 2,
    backgroundColor: theme.colors.lightGrey,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
  },
  date: {
    color: theme.colors.grey,
  },
  acceptButton: {
    marginBottom: 10,
  },
  checkIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  rotateIcon: {
    // transform: [{rotate: '-180deg'}],
    transform: [{ scaleX: -1 }],
  },
  statusText: {
    position: "absolute",
    zIndex: 1,
    top: 5,
    left: 5,
  },
  dealDateText: {
    position: "absolute",
    bottom: 5,
    left: 5,
    zIndex: 1,
    ...theme.styles.scale.body3,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexBasis: "48%",
    // marginHorizontal: 10,
  },
});
