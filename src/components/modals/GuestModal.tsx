import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useLocale from "../../hooks/useLocale";
import useSheet from "../../hooks/useSheet";
import Sheet from "../widgets/Sheet";

interface GuestModalProps {
  isVisible: boolean;
  onCancel?: () => void;
}
const GuestModal = ({ isVisible, onCancel }: GuestModalProps) => {
  const { show, hide, sheetRef } = useSheet();
  const { t } = useLocale("dialogs");
  const { signOut } = useAuth();

  useEffect(() => {
    if (isVisible) {
      show({
        header: t("guestDialog.header"),
        body: t("guestDialog.body"),
        confirmTitle: t("guestDialog.confirmTitle"),
        confirmCallback: () => {
          hide();
          signOut();
        },
        cancelCallback: () => {
          hide();
          // navigation.canGoBack() && navigation.goBack();
          !!onCancel && onCancel();
        },
        closeOnBackdropPress: false,
        hideCloseIcon: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return <Sheet ref={sheetRef} />;
};

export default GuestModal;
