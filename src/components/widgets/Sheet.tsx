import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Text } from "../core";

export interface SheetProps {
  show?: (options: SheetOptions) => void;
  hide?: () => void;
}
export interface SheetOptions {
  header: string;
  body: string;
  type?: "alert" | "warning" | "dialog";
  cancelCallback?: () => void;
  confirmCallback?: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
  closeOnBackdropPress?: boolean;
  children?: React.ReactNode;
  headerIcon?: {
    name: string;
  };
  hideCloseIcon?: boolean;
  hideCancel?: boolean;
}
const Sheet = ({ ...props }: SheetProps, ref: any) => {
  const { t } = useLocale("widgets");
  const [isVisible, setVisible] = useState(false);
  const [sheetOptions, setSheetOptions] = useState<SheetOptions>();

  useImperativeHandle(ref, () => ({
    show(options: SheetOptions) {
      setSheetOptions(options);
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  const closeSheet = useCallback(() => {
    setVisible(false);
  }, []);

  const cancelHandler = useCallback(() => {
    if (sheetOptions?.cancelCallback) {
      sheetOptions?.cancelCallback();
    }
    setVisible(false);
  }, [sheetOptions]);

  const confirmHandler = useCallback(() => {
    if (sheetOptions?.confirmCallback) {
      sheetOptions?.confirmCallback();
    }

    setVisible(false);
  }, [sheetOptions]);

  return sheetOptions ? (
    <Modal
      isVisible={isVisible}
      onClose={closeSheet}
      position={"bottom"}
      onBackdropPress={
        sheetOptions.closeOnBackdropPress ? closeSheet : undefined
      }
      closeIcon={
        sheetOptions?.type === "alert" ? { name: "close", size: 25 } : undefined
      }
      hideCloseIcon={sheetOptions.hideCloseIcon}
      headerIcon={sheetOptions?.headerIcon}
      title={sheetOptions?.header}
    >
      <View>
        <Text style={styles.confirmBody}>{sheetOptions?.body}</Text>
        {sheetOptions?.children}
      </View>

      <View style={styles.modalButtonContainer}>
        {sheetOptions?.type !== "alert" && (
          <>
            {!sheetOptions?.hideCancel && (
              <Button
                title={sheetOptions?.cancelTitle ?? t("sheet.cancelBtnText")}
                style={[styles.modalButton]}
                themeType="white"
                onPress={cancelHandler}
              />
            )}
            <Button
              title={sheetOptions?.confirmTitle ?? t("sheet.confirmBtnText")}
              style={[styles.modalButton, styles.confirmButton]}
              // textStyle={styles.confirmText}
              themeType="primary"
              onPress={confirmHandler}
            />
          </>
        )}
      </View>
    </Modal>
  ) : null;
};

export default React.memo(forwardRef(Sheet));

const styles = StyleSheet.create({
  headerIconContainer: {
    position: "absolute",
  },
  modalButtonContainer: {
    flexDirection: "row",
    marginTop: 30,
    paddingBottom: 10,
    // marginVertical: 40,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  confirmButton: {
    // backgroundColor: theme.colors.white,
    // borderColor: theme.colors.grey,
    // borderWidth: 1,
  },
  confirmText: {
    color: theme.colors.dark,
  },
  confirmTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
  },
  confirmBody: {
    textAlign: "left",
    ...theme.styles.scale.h6,
  },
});
