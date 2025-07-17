import theme from "@/styles/theme";
import React, { FC, useCallback } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../core";

interface ModalViewProps extends ViewProps {
  title?: string;
  showHeaderNav?: boolean;
  onClose?: () => void;
}
const ModalView: FC<ModalViewProps> = ({
  style,
  title,
  showHeaderNav = true,
  children,
  onClose,
}) => {
  const onBack = useCallback(() => {
    console.log("onmodal bacck");
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={["right", "top", "left"]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={[styles.modalHeader]}>
        {showHeaderNav && (
          <Pressable onPress={onBack}>
            <Icon
              style={styles.modalNav}
              name="chevron-left"
              color={theme.colors.grey}
              size={35}
            />
          </Pressable>
        )}

        <View style={styles.modalTitleContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.childrenContainer}>{children}</View>
    </SafeAreaView>
  );
};

export default ModalView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    // paddingHorizontal: 30,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitleContainer: {
    // alignSelf: 'flex-end',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 35,
  },
  modalTitle: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
    // alignSelf: 'center',
    marginVertical: 20,
  },
  modalNav: {
    // alignSelf: 'flex-end',
    // marginRight: 'auto',
    // left: 0,
    // position: 'absolute',
  },
  childrenContainer: {
    flex: 1,
  },
});
