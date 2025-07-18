import { Icon } from "@/components/core";
import PressableOpacity from "@/components/core/PressableOpacity";
import theme from "@/styles/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ItemEditIconProps {
  onDelete?: () => void;
}
const ItemEditIcon = ({ onDelete }: ItemEditIconProps) => {
  const onEdit = () => {};
  const onDeleteHandler = async () => {
    if (onDelete) {
      onDelete();
    }
  };
  return (
    <View style={styles.container}>
      {/* <PressableObacity onPress={onEdit}>
        <Icon
          style={styles.editIcon}
          name="pencil-outline"
          // color="#F2A39C"
          color={theme.colors.grey}
          size={25}
        />
      </PressableObacity> */}
      <PressableOpacity onPress={onDeleteHandler}>
        <Icon
          // style={styles.errorIcon}
          name="trash-can-outline"
          // color="#F2A39C"
          color={theme.colors.grey}
          size={25}
        />
      </PressableOpacity>
    </View>
  );
};

export default React.memo(ItemEditIcon);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  editIcon: {
    // marginHorizontal: 5,
  },
});
