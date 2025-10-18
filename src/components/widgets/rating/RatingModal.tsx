import { RatingWeight, StarItem } from "@/api/ratingApi";
import { Button, Modal, Text } from "@/components/core";
import useLocale from "@/hooks/useLocale";
import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import RatingView, { RatingViewProps } from "./RatingView";

export interface RatingModalProps {
  stars: StarItem[];
  isVisible: boolean;
  onClose: () => void;
  count?: number;
  onRatingChange?: (ratingWeight: RatingWeight, comments?: string) => void;
  defaultValue?: number;
  onStarPress?: RatingViewProps["onStarPress"];
}
const RatingModal = ({
  isVisible,
  stars,
  onClose,
  onStarPress,
  onRatingChange,
}: RatingModalProps) => {
  const [comments, setComments] = useState<string | undefined>();
  const { t } = useLocale("widgets");

  const rated = useMemo(
    () => stars.filter((s) => s.selected)?.length > 0,
    [stars]
  );
  const onRate = useCallback(() => {
    if (onRatingChange) {
      onRatingChange(
        stars.filter((s) => s.selected).length as RatingWeight,
        comments
      );
    }
    onClose();
  }, [comments, onRatingChange, onClose, stars]);
  const disableBackdropPress = () => undefined;
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      onBackdropPress={disableBackdropPress}
      title={t("rating.header")}
      avoidKeyboard
      containerStyle={styles.modal}
    >
      <View style={styles.contentContainer}>
        {/* <Text style={styles.header}>{t('rating.header')}</Text> */}
        <Text style={styles.body}>{t("rating.body")}</Text>
      </View>
      <RatingView stars={stars} onStarPress={onStarPress} />

      {rated && (
        <TextInput
          multiline={true}
          numberOfLines={5}
          placeholder={t("rating.inputPlaceholder")}
          placeholderTextColor={theme.colors.grey}
          style={[sharedStyles.textArea, styles.textArea]}
          onChangeText={setComments}
        />
      )}

      <Button
        disabled={!rated}
        title={t("rating.btnSubmitTitle")}
        onPress={onRate}
      />
    </Modal>
  );
};

export default React.memo(RatingModal);

const styles = StyleSheet.create({
  modal: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1,
    marginBottom: 10,
  },

  keyboardContainer: {
    // flex: 1,
    // height: '100%',
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    ...theme.styles.scale.h5,
    color: theme.colors.salmon,
    marginBottom: 5,
    fontWeight: "600",
  },
  body: {
    ...theme.styles.scale.h6,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    // paddingVertical: 20,
    // paddingBottom: 30,
  },
  textArea: {
    // flex: 1,
    marginBottom: 10,
    height: 100,
    textAlignVertical: "top",
  },
  error: {
    // borderColor: theme.colors.salmon,
    // borderWidth: 1,
  },
});
