import React, { useCallback } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { CheckBox } from "../core";
import useController from "../../hooks/useController";
import theme from "../../styles/theme";
import { FormProps } from "../../types/DataTypes";
import { Text } from "../core";
import Error from "./Error";

interface RadioProps extends FormProps {
  options: { id: string; label: string }[];
  radioSize?: number;
  onChange?: (value: string) => void;
  horizontal?: boolean;
  groupStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  type?: "check";
}
const RadioGroup = ({
  name,
  options,
  control,
  defaultValue,
  onChange,
  horizontal = false,
  groupStyle,
  containerStyle,
  labelStyle,
  label,
}: RadioProps) => {
  const { field, formState } = useController({
    control,
    defaultValue,
    name,
  });
  const onOptionChange = useCallback(
    (id: string, value: boolean) => {
      if (value === true) {
        field.onChange(id);
      } else {
        field.onChange("");
      }
      if (onChange) {
        onChange(value ? id : "");
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
          <CheckBox
            key={item.id}
            label={item.label}
            onChange={(v) => onOptionChange(item.id, v)}
            value={field.value === item.id}
          />
        ))}
      </View>
      <Error error={formState.errors[name]} />
    </View>
  );
};

export default React.memo(RadioGroup);

const styles = StyleSheet.create({
  container: {
    // flexWrap: 'wrap',
    // backgroundColor: 'grey',
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
