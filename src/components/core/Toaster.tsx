import React from "react";
import { Pressable, View, ViewProps } from "react-native";
import Toast, { BaseToastProps } from "react-native-toast-message";
import create from "../../styles/EStyleSheet";
import theme from "../../styles/theme";
import { Status } from "../../types/DataTypes";
import Icon from "./Icon";
import Text from "./Text";

interface ToasterProps extends ViewProps, Status {
  ref?: (instance: unknown) => void;
  onClose?: () => void;
}

type Icons = { [key in keyof Status["type"]]: StatusIcon };

type StatusIcon = { icon: string; bgColor: string };
const icons: Icons = {
  success: { icon: "check-circle-outline", bgColor: theme.colors.green },
  info: { icon: "check-circle-outline", bgColor: theme.colors.green },
  warn: { icon: "alert-outline", bgColor: theme.colors.warn },
  error: { icon: "alert-circle", bgColor: theme.colors.salmon },
};

// const Toast = {
//   durations: {
//     SHORT: 2000,
//     LONG: 5000,
//   },
//   fadein: 200,
//   fadeout: 2000,
// };

const Toaster = ({ message, type = "error", ...props }: ToasterProps) => {
  // const [show, setShow] = useState<boolean>(true);
  // const fadeAnim = useRef(new Animated.Value(0)).current;

  const iconName = (icons as any)[type]?.icon ?? icons.success.icon;

  const onDismiss = () => {
    Toast.hide();
  };

  return (
    <View
      style={[
        styles.viewContainer,
        props.style,
        { backgroundColor: (icons as any)[type].bgColor },
      ]}
    >
      <View style={styles.errorIconContainer}>
        <Icon
          style={styles.errorIcon}
          name={iconName}
          // color="#F2A39C"
          color="white"
          size={35}
        />
      </View>

      <Text numberOfLines={2} body2 style={styles.text}>
        {message}
      </Text>
      <Pressable
        style={styles.closeIconContainer}
        hitSlop={30}
        onPress={onDismiss}
      >
        <Icon
          style={styles.closeIcon}
          name="close"
          color={theme.colors.white}
          size={20}
        />
      </Pressable>
    </View>
  );
};

export const toastConfig = {
  success: ({ text1 }: BaseToastProps) => (
    <Toaster message={text1!} type="success" />
  ),
  error: ({ text1 }: BaseToastProps) => (
    <Toaster message={text1!} type="error" />
  ),
  info: ({ text1 }: BaseToastProps) => <Toaster message={text1!} type="info" />,
  warn: ({ text1 }: BaseToastProps) => <Toaster message={text1!} type="warn" />,
};

const styles = create({
  container: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    padding: 10,
    top: 0,
  },
  viewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 65,
    backgroundColor: theme.colors.salmon,
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    marginHorizontal: 10,
  },
  errorIconContainer: {
    // backgroundColor: theme.colors.white,
    padding: 0,
    margin: 0,
  },
  text: {
    flex: 1,
    color: theme.colors.white,
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorIcon: {
    padding: 0,
    margin: 0,
  },
  closeIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  closeIcon: {},
});

export default React.memo(Toaster);
