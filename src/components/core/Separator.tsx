import create from "@/styles/EStyleSheet";
import theme from "@/styles/theme";
import React, { FC } from "react";
import { View, ViewProps } from "react-native";
// import create from '../styles/EStyleSheet';

const Separator: FC<ViewProps> = (props) => {
  return (
    <View {...props} style={[styles.container, props.style]}>
      {/* <View style={styles.container} /> */}
    </View>
  );
};

const styles = create(
  {
    container: {
      width: "100%",
      backgroundColor: theme.colors.lightGrey,
      height: 2,
      // borderStyle: 'dotted',
      // paddingVertical: 2,
    },
  },
  false
);

export default React.memo(Separator);
