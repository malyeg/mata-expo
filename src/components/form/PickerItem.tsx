import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { Entity, Nestable } from "@/types/DataTypes";
import React, { FC, useCallback } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from "react-native";
import { Icon } from "../core";
import { ChevronIcon } from "../core/Icon";
import Text from "../core/Text";

// export type PickerItem = {value: string; label?: string};

type PickerItemProps = {
  item: Entity;
  selected?: boolean;
  onChange: (item: Entity) => void;
  children?: React.ReactElement | null | undefined;
  onPress?: () => void;
  chevronStyle?: StyleProp<TextStyle>;
};
const PickerItem: FC<PickerItemProps> = ({
  item,
  onChange,
  selected,
  onPress,
  chevronStyle,
  children,
}) => {
  const onItemChange = useCallback(() => {
    if (onPress) {
      onPress();
    }
    onChange(item);
  }, [item, onChange, onPress]);

  const { locale } = useLocale();

  const nestedEntity = item as unknown as Nestable;
  return (
    <Pressable onPress={onItemChange} style={styles.container}>
      <View style={styles.itemContainer}>
        {!!item.emoji && <Text style={styles.emoji}>{item.emoji}</Text>}
        <Text body1 style={styles.text} adjustsFontSizeToFit={true}>
          {item.localizedName?.[locale] ?? item.name ?? item.id}
        </Text>
        {nestedEntity.level === -1
          ? selected && (
              <Icon
                name={"check-circle"}
                size={25} // TODO change to responsive
                color={theme.colors.green}
                style={styles.selectedIcon}
              />
            )
          : nestedEntity?.level > -1 &&
            nestedEntity.hasChildren !== false && (
              // <Icon
              //   name="chevron-right"
              //   color={theme.colors.grey}
              //   size={35}
              //   style={[styles.chevronIcon, chevronStyle]}
              // />
              <ChevronIcon
                style={[styles.chevronIcon, chevronStyle]}
                size={35}
              />
            )}
      </View>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: 30,
  },
  itemContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    height: 61,
  },
  text: {
    // flex: 1,
    // paddingHorizontal: 10,
    // textAlignVertical: "center",
    // justifyContent: "flex-start",
    // alignItems: "center",
  },
  selectedIcon: {
    textAlignVertical: "center",
    marginStart: "auto",
  },
  emoji: {
    ...theme.styles.scale.h4,
    marginEnd: 10,
  },
  chevronIcon: {
    marginStart: "auto",
  },
});

export default React.memo(PickerItem);
