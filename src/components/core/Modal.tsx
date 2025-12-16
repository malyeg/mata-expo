import { theme } from "@/styles/theme";
import React, { FC, useCallback } from "react";
import {
  Keyboard,
  Pressable,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import ModalBase, {
  Direction,
  ModalProps as ModalBaseProps,
} from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SuccessIcon from "../icons/SuccessIcon";
import Icon, { ChevronBackIcon, IconProps } from "./Icon";
import Text from "./Text";

export interface ModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  position?: "bottom" | "full";
  showHeaderNav?: boolean;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  onModalShow?: () => void;
  onModalHide?: () => void;
  onBackdropPress?: () => void;
  propagateSwipe?: boolean;
  scrollHorizontal?: boolean;
  swipeDirection?: Direction | Direction[] | undefined;
  closeIcon?: IconProps;
  animationIn?: ModalBaseProps["animationIn"];
  animationOut?: ModalBaseProps["animationOut"];
  avoidKeyboard?: boolean;
  hideCloseIcon?: boolean;
  headerIcon?: {
    name: string;
  };
}
const Modal: FC<ModalProps> = ({
  isVisible = false,
  position = "bottom",
  showHeaderNav,
  title,
  onClose,
  children,
  onModalShow,
  onModalHide,
  onBackdropPress,
  containerStyle,
  bodyStyle,
  style,
  scrollHorizontal = false,
  swipeDirection,
  propagateSwipe,
  animationIn,
  animationOut,
  closeIcon,
  hideCloseIcon,
  avoidKeyboard,
  headerIcon,
}) => {
  const { top, bottom } = useSafeAreaInsets();
  const onBack = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  return (
    <ModalBase
      coverScreen={true}
      style={[styles.modal, style]}
      useNativeDriver={true}
      isVisible={isVisible}
      swipeDirection={swipeDirection}
      hideModalContentWhileAnimating={true}
      onSwipeComplete={onClose}
      onBackdropPress={onBackdropPress ? onClose : undefined}
      onBackButtonPress={onClose}
      onModalShow={onModalShow}
      onModalHide={onModalHide}
      scrollHorizontal={scrollHorizontal}
      backdropTransitionOutTiming={0}
      animationIn={animationIn}
      animationOut={animationOut}
      avoidKeyboard={avoidKeyboard}
      propagateSwipe={propagateSwipe}
    >
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { paddingBottom: bottom },
            position === "full" ? { paddingTop: top } : undefined,
            position === "bottom" ? styles.bottomStyle : styles.fullScreen,
            containerStyle,
          ]}
        >
          <View style={[styles.modalHeader]}>
            {headerIcon && (
              <SuccessIcon style={styles.headerIcon} name={headerIcon.name} />
            )}
            {showHeaderNav && position === "full" && (
              <ChevronBackIcon
                color={theme.colors.grey}
                size={35}
                style={styles.chevronBackIcon}
                onPress={onBack}
              />
            )}
            {!!title && (
              <View
                style={[
                  styles.modalTitleContainer,
                  headerIcon ? styles.titleWithHeaderIcon : {},
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    position === "bottom" ? styles.titleBottom : {},
                  ]}
                >
                  {title}
                </Text>
                {position === "bottom" && !hideCloseIcon && (
                  <Icon
                    name="chevron-down"
                    color={theme.colors.grey}
                    size={35}
                    style={styles.chevronDownIcon}
                    onPress={onBack}
                    {...closeIcon}
                  />
                )}
              </View>
            )}
          </View>
          <View
            style={[
              styles.body,
              position === "full" ? styles.fullScreen : undefined,
              bodyStyle,
            ]}
          >
            {children}
          </View>
        </View>
      </Pressable>
    </ModalBase>
  );
};

export default React.memo(Modal);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: "flex-end",
  },
  container: {
    // flex: 1,
    backgroundColor: theme.colors.white,
    // backgroundColor: 'transparent',
  },
  headerIcon: {
    position: "absolute",
    backgroundColor: "transparent",
    width: "100%",
    top: -40,
  },
  titleWithHeaderIcon: {
    marginTop: 20,
  },
  bottomStyle: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  body: {
    paddingHorizontal: 20,
  },
  fullScreen: {
    flex: 1,
  },
  positionFull: {
    flex: 1,
  },
  positionBottom: {
    // marginTop: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
    marginVertical: 20,
    paddingRight: 35,
  },
  chevronDownIcon: {
    color: theme.colors.salmon,
    position: "absolute",
    right: 20,
  },
  titleBottom: { marginLeft: 35 },
  chevronBackIcon: {
    marginStart: 10,
  },
});
