import React, { useCallback } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { CheckBox } from ".";
import useController from "../../hooks/useController";
import theme from "../../styles/theme";
import { FormProps } from "../../types/DataTypes";
import { Text } from "../core";
import Error from "./Error";

interface OptionGroupProps extends FormProps {
  options: { id: string; label: string }[];
  radioSize?: number;
  onChange?: (value: string) => void;
  horizontal?: boolean;
  groupStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  type?: "circle" | "box";
}
const OptionGroup = ({
  name,
  options,
  control,
  defaultValue,
  onChange,
  horizontal = false,
  radioSize = 25,
  groupStyle,
  containerStyle,
  labelStyle,
  label,
}: OptionGroupProps) => {
  const { field, formState } = useController({
    control,
    defaultValue,
    name,
  });
  const onPressHandler = useCallback(
    (id: string) => {
      field.onChange(id);
      if (onChange) {
        onChange(id);
      }
    },
    [field, onChange]
  );

  return (
    <View style={[containerStyle]}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.container,
          groupStyle,
          horizontal ? styles.horizontal : {},
        ]}
      >
        {options.map((item) => (
          <CheckBox key={item.id} control={control} name={item.id} />
        ))}
      </View>
      <Error error={formState.errors[name]} />
    </View>
  );
};

export default React.memo(OptionGroup);

const styles = StyleSheet.create({
  container: {
    // flexWrap: 'wrap',
  },
  horizontal: {
    flexDirection: "row",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  outerCircle: {
    borderWidth: 1,
    borderColor: theme.colors.grey,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  innerCircle: {
    borderColor: theme.colors.grey,
  },
  active: {
    backgroundColor: theme.colors.salmon,
  },
  label: {
    marginBottom: 5,
  },
});
