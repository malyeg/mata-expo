import theme from "@/styles/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";

interface ListLoaderProps extends ViewProps {}
const ListLoader = (props: ListLoaderProps) => {
  return (
    <View style={styles.loader} {...props}>
      <ActivityIndicator color={theme.colors.salmon} size="large" />
    </View>
  );
};

export default React.memo(ListLoader);

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
