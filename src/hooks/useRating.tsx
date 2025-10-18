import RatingModal, {
  RatingModalProps,
} from "@/components/widgets/rating/RatingModal";
import RatingView, {
  RatingViewProps,
} from "@/components/widgets/rating/RatingView";
import { useCallback, useEffect, useState } from "react";
import { StarItem } from "../api/ratingApi";
interface UseRatingProps {
  count?: number;
  defaultValue?: number;
  ratingModalVisible?: boolean;
  ratingViewEditable?: boolean;
  // onRatingChange?: (ratingWeight: RatingWeight, comments?: string) => void;
}

export interface RatingModalHandlers {
  rateDealHandler: () => void;
  closeModalHandler?: () => void;
}

const useRating = (
  {
    count = 5,
    defaultValue = 0,
    ratingModalVisible = false,
    ratingViewEditable = true,
  } = {} as UseRatingProps
) => {
  const [stars, setStars] = useState<StarItem[]>([]);
  const [isRatingModalVisible, setRatingModalVisible] =
    useState(ratingModalVisible);
  const [dValue, setDefaultValue] = useState(defaultValue);

  const [ratingModalHandlers, setRatingModalHandlers] =
    useState<RatingModalHandlers>();

  useEffect(() => {
    const starList = new Array(count)
      .fill(undefined)
      .map((v, i) => ({ index: i, selected: i < dValue ? true : false }));

    setStars(starList);
  }, [count, dValue]);

  const cancel = useCallback(() => {
    const starList = new Array(count)
      .fill(undefined)
      .map((v, i) => ({ index: i, selected: i < dValue ? true : false }));
    setStars(starList);
    setRatingModalVisible(false);
    if (ratingModalHandlers && ratingModalHandlers.closeModalHandler) {
      ratingModalHandlers.closeModalHandler();
    }
  }, [count, dValue, ratingModalHandlers]);

  const updateStars = useCallback(
    (index: number) => {
      const starList = new Array(count)
        .fill(undefined)
        .map((v, i) => ({ index: i, selected: i < index + 1 ? true : false }));
      setStars(starList);
    },
    [count]
  );

  // const onRatingChange = (ratingWeight: RatingWeight, comments = '') => {
  //   if (deal) {
  //     const dealRating: DealRating = {rate: ratingWeight, comments};
  //     const ratedUserId =
  //       deal.userId === user.id ? deal.item.userId : deal.userId;
  //     console.log('onRatingChange', {userId: user.id, ratedUserId});
  //     request(() => dealsApi.rateDeal(deal?.id!, ratedUserId, dealRating));
  //   }
  // };

  const onViewStarPress = useCallback(
    (index: number) => {
      updateStars(index);
      setRatingModalVisible(true);
    },
    [updateStars]
  );

  let ratingViewProps: RatingViewProps = {
    stars,
    onStarPress: ratingViewEditable ? onViewStarPress : undefined,
  };

  // const onRateDeal = (
  //   ratingWeight: RatingWeight,
  //   comments?: string | undefined,
  // ) => {
  //   if (onRatingChange) {
  //     onRatingChange(ratingWeight, comments);
  //   }
  //   if (ratingModalHandlers) {
  //     ratingModalHandlers.rateDealHandler();
  //   }
  // };

  const onOpenRatingModal = (modalHandlers?: RatingModalHandlers) => {
    if (!dValue) {
      setDefaultValue(dValue);
    }
    setRatingModalVisible(true);
    if (modalHandlers) {
      console.log("setting modalHandlers", modalHandlers);
      setRatingModalHandlers(modalHandlers);
    }
  };

  const ratingModalProps: RatingModalProps = {
    stars,
    isVisible: isRatingModalVisible,
    onClose: cancel,
    defaultValue: dValue,
    onStarPress: updateStars,
  };

  return {
    // values
    ratingViewProps,
    ratingModalProps,
    defaultValue: dValue,
    // functions
    setDefaultValue,
    openRatingModal: onOpenRatingModal,
    // closeRatingModal: cancel,
    // components,
    RatingView,
    RatingModal,
  };
};

export default useRating;

// const styles = StyleSheet.create({});
