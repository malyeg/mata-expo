import React, { FC, useCallback } from "react";
import { Pressable, StyleSheet, ViewProps } from "react-native";
import useController from "../../hooks/useController";
import theme from "../../styles/theme";
import { Icon, Text } from "../core";
interface CheckBoxProps extends ViewProps {
  name: string;
  size?: number;
  boxType?: "square" | "circle";
  value?: boolean | undefined;
  label?: string;
  onChange?: (v: boolean) => void;
  defaultValue?: boolean;
  control?: any;
}
const CustomCheckBox: FC<CheckBoxProps> = ({
  name,
  size = 22,
  boxType = "square",
  label,
  defaultValue = false,
  onChange,
  control,
  ...props
}) => {
  const { field, formState } = useController({
    control,
    defaultValue,
    name,
  });
  // const [selected, setSelected] = useState<boolean>(false);

  const selectedIcon =
    boxType === "square" ? "checkbox-marked" : "checkbox-marked-circle";
  const emptyIcon =
    boxType === "square"
      ? "checkbox-blank-outline"
      : "checkbox-blank-circle-outline";

  const onToggle = useCallback(() => {
    // setSelected((v: boolean) => {
    //   field.onChange(!v);
    //   return !v;
    // });
    field.onChange(!field.value);
    if (onChange) {
      onChange(!field.value);
    }
  }, [field, onChange]);

  const hasError = !!name && !!formState.errors && !!formState.errors[name];
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.container, styles.checkBoxContainer, props.style]}
    >
      <Icon
        name={field.value ? selectedIcon : emptyIcon}
        size={size}
        style={[
          field.value
            ? styles.selected
            : hasError
            ? styles.error
            : styles.unselected,
        ]}
      />
      {label && (
        <Text body1 style={[styles.text, hasError ? styles.error : {}]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  unselected: {
    color: theme.colors.grey,
  },
  selected: {
    color: theme.colors.green,
  },
  text: {
    paddingLeft: 10,
    fontWeight: theme.fontWeight.semiBold,
  },
  error: {
    color: theme.colors.salmon,
  },
});

// export default React.memo(CustomCheckBox);
export default CustomCheckBox;
