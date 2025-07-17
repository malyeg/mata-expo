import useLocale from "@/hooks/useLocale";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, CheckBox, Modal } from "../core";

interface AcceptOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAccept: (rejectOtherOffer: boolean) => void;
}
const AcceptOfferModal = ({
  isVisible,
  onClose,
  onAccept,
}: AcceptOfferModalProps) => {
  const { t } = useLocale("widgets");
  const [rejectOffers, setRejectOffers] = useState(false);
  const acceptHandler = () => {
    try {
      onAccept(rejectOffers);
    } finally {
      onClose();
    }
  };
  const toggleOffer = (v: boolean) => {
    setRejectOffers(v);
  };
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      onBackdropPress={onClose}
      closeIcon={{ name: "close", size: 25 }}
      title={t("acceptOfferModal.title")}
    >
      <CheckBox
        onChange={toggleOffer}
        value={rejectOffers}
        style={styles.toggle}
        hitSlop={10}
        label={t("acceptOfferModal.rejectOtherOffersTitle")}
      />
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.button}
          themeType="white"
          title={t("acceptOfferModal.cancelBtnTitle")}
          onPress={onClose}
        />
        <Button
          style={styles.button}
          title={t("acceptOfferModal.acceptBtnTitle")}
          onPress={acceptHandler}
        />
      </View>
    </Modal>
  );
};

export default AcceptOfferModal;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flexBasis: "48%",
  },
  toggle: {
    marginVertical: 20,
  },
});
