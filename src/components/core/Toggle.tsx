import theme from "@/styles/theme";
import React from "react";
import { StyleProp, StyleSheet, Switch, View, ViewStyle } from "react-native";
import { Text } from ".";

interface ToggleProps {
  onChange: (v: boolean) => void;
  value?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}
const Toggle = ({ value, label, onChange, style }: ToggleProps) => {
  return (
    <View style={[styles.container, style]}>
      <Switch
        trackColor={{
          false: theme.colors.lightGrey,
          true: theme.colors.lightGreen,
        }}
        thumbColor={value ? theme.colors.green : theme.colors.grey}
        // ios_backgroundColor="#3e3e3e"
        onValueChange={onChange}
        value={value}
      />
      {label && <Text>{label}</Text>}
    </View>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
  },
});
