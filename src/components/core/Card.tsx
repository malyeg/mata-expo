import theme from "@/styles/theme";
import React, { ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Icon, { ChevronIcon, IconProps } from "./Icon";

interface CardProps extends ViewProps {
  icon?: IconProps;
  onPress?: () => void;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  hideChevron?: boolean;
}
const Card = ({ style, icon, onPress, ...props }: CardProps) => {
  return onPress !== undefined ? (
    <Pressable
      style={[styles.container, style, icon ? styles.hasIcon : {}]}
      onPress={onPress}
    >
      <CardBody icon={icon} onPress={onPress} {...props} />
    </Pressable>
  ) : (
    <View style={[styles.container, style, icon ? styles.hasIcon : {}]}>
      <CardBody {...props} />
    </View>
  );
};

const CardBody = ({ hideChevron, icon, children, onPress }: CardProps) => {
  return (
    <>
      {!!icon && (
        <Icon
          name={icon.name}
          color={theme.colors.salmon}
          style={styles.icon}
          type={icon.type}
          size={icon.size ?? 25}
        />
      )}
      {children}
      {!!onPress && !hideChevron && (
        <ChevronIcon
          color={theme.colors.salmon}
          style={styles.chevron}
          size={25}
        />
      )}
    </>
  );
};

export default React.memo(Card);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.grey,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        shadowColor: theme.colors.grey,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        elevation: 3,
      },
    }),
  },
  icon: {
    // position: 'absolute',
    // left: 10,
    marginRight: 5,
  },
  chevron: {
    marginLeft: "auto",
  },
  hasIcon: {
    // marginRight: 'auto',
  },
  hasChevron: {
    // paddingRight: 20,
    // marginRight: 'auto',
  },
  content: {
    flex: 1,
  },
});
