import React, { useCallback, useEffect, useState } from "react";
import {
  I18nManager,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";
import useController from "../../hooks/useController";
import theme from "../../styles/theme";
import { Icon, Text } from "../core";
import Error from "./Error";

interface AppTextInputProps extends TextInputProps {
  name: string;
  type?: "secret" | "plain";
  value?: string;
  defaultValue?: string;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  hideError?: boolean;
  label?: string;
  disabled?: boolean;
  control?: any;
  hideLabel?: boolean;
  onEyeToggle?: (v: boolean) => void;
  showReset?: boolean;
}
const rtlSecretStyle: TextStyle = {
  textAlign: "right",
};

const TextInputField = React.forwardRef<TextInput, AppTextInputProps>(
  (
    {
      name,
      defaultValue = "",
      autoCorrect = false,
      autoCapitalize = "none",
      label,
      disabled,
      value,
      onChangeText,
      hideError = false,
      control,
      hideLabel,
      onEyeToggle,
      showReset,
      errorStyle,
      ...props
    }: AppTextInputProps,
    ref
  ) => {
    const {
      field,
      fieldState: { error },
    } = useController({
      control,
      defaultValue,
      name,
    });
    // const [showLabel, setShowLabel] = useState(field.value ? true : false);
    const [focused, setFocused] = useState(false);
    const [eyeIconOn, setEyeIconOn] = useState<boolean>(
      props.secureTextEntry ?? false
    );

    useEffect(() => {
      if (value && value !== field.value) {
        field.onChange(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const toggleEyeIcon = useCallback(() => {
      setEyeIconOn((v) => {
        if (onEyeToggle) {
          onEyeToggle(!v);
        }
        return !v;
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onResetHandler = () => {
      field.onChange(defaultValue ?? undefined);
    };

    const onChangeTextHandler = useCallback(
      (v: string) => {
        if (v !== field.value) {
          field.onChange(v);
        }
        if (onChangeText) {
          onChangeText(v);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [field]
    );

    const enableFocus = () => setFocused(true);
    const disableFocus = () => {
      field.onBlur();
      setFocused(false);
    };

    return (
      <View style={[styles.container, props.style]}>
        {!!field.value && !hideLabel && (
          <Text body3 style={[styles.label]}>
            {label ?? props.placeholder}
          </Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            {...props}
            ref={ref}
            autoCorrect={autoCorrect}
            autoCapitalize={autoCapitalize}
            editable={!disabled}
            value={field.value}
            secureTextEntry={props.secureTextEntry && eyeIconOn}
            testID={name}
            style={[
              I18nManager.isRTL && rtlSecretStyle,
              styles.textInput,
              props.inputStyle,
              props.multiline === false
                ? styles.onelineInput
                : styles.multilineInput,
              error
                ? styles.textInputBorderError
                : focused
                ? styles.textInputActive
                : styles.textInputBorder,
              disabled ? styles.disabled : {},
            ]}
            onFocus={enableFocus}
            onBlur={disableFocus}
            placeholderTextColor={theme.colors.grey}
            onChangeText={onChangeTextHandler}
          />
          {props.secureTextEntry && (
            <Icon
              style={[styles.eyeIcon]}
              name={eyeIconOn ? "eye-off" : "eye"}
              size={25} // TODO change to responsive
              color={theme.colors.dark}
              onPress={toggleEyeIcon}
            />
          )}
          {showReset && !!field.value && (
            <Icon
              name="close"
              size={20}
              color={theme.colors.green}
              style={styles.resetIcon}
              onPress={onResetHandler}
            />
          )}

          {!hideError && error && (
            <Error error={error} style={[styles.error, errorStyle]} />
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    // minHeight: 60,
    // maxHeight: 60,
  },
  label: {
    // paddingTop: 10,
    color: theme.colors.grey,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  textInput: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.medium,

    borderBottomWidth: 1,
    color: theme.colors.dark,
  },
  onelineInput: {
    height: 40,
  },
  multilineInput: {
    maxHeight: 80,
  },
  disabled: {
    color: theme.colors.grey,
  },
  textInputBorder: {
    borderColor: theme.colors.grey,
  },
  textInputActive: {
    borderColor: theme.colors.green,
  },
  textInputBorderError: {
    borderColor: theme.colors.salmon,
  },
  eyeIcon: {
    position: "absolute",
    bottom: 2,
    right: 0,
  },
  resetIcon: {
    position: "absolute",
    // bottom: 0,
    right: 0,
  },
  error: {
    marginTop: 5,
  },
});

export default React.memo(TextInputField);
