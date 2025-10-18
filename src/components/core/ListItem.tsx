import theme from "@/styles/theme";
import React, { FC } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
} from "react-native";
import Icon from "./Icon";
import Text from "./Text";

interface ListItemProps extends ViewProps {
  selected?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  icon?: string;
  iconColor?: string;
  text: string;
  textStyle?: TextStyle;
}
const ListItem: FC<ListItemProps> = ({
  text,
  selected,
  icon,
  iconColor = theme.colors.dark,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={styles.textContainer}>
        {!!icon && (
          <Icon name={icon} size={25} color={iconColor} style={styles.icon} />
        )}
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
      {selected && (
        <Icon
          name={"check-circle"}
          size={25}
          color={theme.colors.green}
          style={styles.icon}
        />
      )}
    </Pressable>
  );
};

export default React.memo(ListItem);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 61,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { textAlignVertical: "center" },
  text: {
    // marginLeft: 0,
    marginHorizontal: 10,
  },
});
