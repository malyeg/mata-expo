import sharedStyles from "@/styles/SharedStyles";
import theme from "@/styles/theme";
import { BaseViewProps } from "@/types/ReactTypes";
import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from "react-native";
import { Icon, Text } from ".";

interface AccordionProps extends BaseViewProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}
const Accordion = ({
  title,
  style,
  titleStyle,
  children,
  onPress: onPressProp,
}: AccordionProps) => {
  const [isOpen, setOpen] = useState(false);
  const onPress = () => {
    setOpen((v) => !v);
    !!onPressProp && onPressProp();
  };
  return (
    <Pressable
      style={[sharedStyles.shadowBox, styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.titleContainer}>
        <Text style={[styles.titleText, titleStyle]}>{title}</Text>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          style={styles.chevron}
        />
      </View>
      {isOpen && children}
    </Pressable>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 5,
    marginVertical: 2,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontWeight: "bold",
  },
  chevron: {
    color: theme.colors.salmon,
    marginLeft: "auto",
    fontSize: 30,
  },
});
