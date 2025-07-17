import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { useRouter } from "expo-router";
import React, { ReactElement, ReactNode, useCallback } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from "react-native";
import { Icon, Text } from "../core";
import { IconType } from "../core/Icon";

interface CardProps {
  title: string;
  content: string | ReactElement;
  icon?: string;
  iconType?: IconType;
  contentStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
  to?: { screen: string; params?: any };
}
const ItemDetailsCard = ({
  title,
  content,
  icon,
  iconType,
  contentStyle,
  iconStyle,
  children,
  to,
}: CardProps) => {
  const router = useRouter();

  const onPress = useCallback(() => {
    if (to) {
      router.navigate(to.screen as any, to.params);
    }
  }, [router, to]);
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {!!icon && (
        <Icon
          name={icon}
          type={iconType}
          color={theme.colors.salmon}
          style={[styles.icon, iconStyle]}
        />
      )}
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text
            style={[styles.content, contentStyle]}
            numberOfLines={3}
            adjustsFontSizeToFit
          >
            {content}
          </Text>
        </View>
        {!!children && <View style={styles.childrenContainer}>{children}</View>}
      </View>
      {to && (
        <Icon
          name="chevron-right"
          color={theme.colors.salmon}
          style={styles.chevron}
          size={25}
        />
      )}
    </Pressable>
  );
};

export default ItemDetailsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 5,
    // borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // backgroundColor: theme.colors.white,
    // borderColor: theme.colors.lightGrey,
    // borderWidth: 1,
    ...sharedStyles.shadowBox,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: theme.colors.grey,
    //     shadowOffset: {width: 1, height: 1},
    //     shadowOpacity: 0.6,
    //     shadowRadius: 1,
    //   },
    //   android: {
    //     shadowColor: theme.colors.grey,
    //     shadowOffset: {width: 1, height: 1},
    //     shadowOpacity: 0.3,
    //     elevation: 3,
    //   },
    // }),
  },
  icon: {
    position: "absolute",
    left: 7,
  },
  header: {
    flexDirection: "row",
    // flexWrap: 'wrap',
    alignItems: "center",
    marginLeft: 25,
  },
  title: {
    color: theme.colors.salmon,
    width: 85,
    // fontWeight: '700',
    // marginLeft: 5,
  },
  content: {
    textTransform: "capitalize",
    width: "70%",
    // textAlign: 'justify',
  },
  childrenContainer: {
    marginLeft: 25,
  },
  chevron: {
    position: "absolute",
    right: 0,
  },
});
