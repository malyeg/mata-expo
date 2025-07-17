import React, { FC } from "react";
import { FormProvider } from "react-hook-form";
import { KeyboardAvoidingView, TextStyle, View, ViewProps } from "react-native";
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import create from "@/styles/EStyleSheet";
import { Status } from "@/types/DataTypes";

interface FormProps extends ViewProps {
  methods: any;
  error?: Status;
  errorStyle?: TextStyle;
  behavior?: "padding" | "height" | "position" | undefined;
  disableKeyboardAvoiding?: boolean;
  children: React.ReactNode;
}

const Form: FC<FormProps> = ({
  behavior = "padding",
  // behavior = Platform.OS === 'ios' ? 'padding' : undefined,
  disableKeyboardAvoiding,
  ...props
}) => {
  return !disableKeyboardAvoiding ? (
    <KeyboardAvoidingView
      contentContainerStyle={[styles.container]}
      behavior={behavior}
      {...props}
    >
      <FormContent {...props} />
    </KeyboardAvoidingView>
  ) : (
    <FormContent {...props} />
  );
};

const FormContent = (props: any) => {
  return (
    <FormProvider {...props.methods}>
      <View style={[styles.formContainer, props.style]}>{props.children}</View>
    </FormProvider>
  );
};

const styles = create({
  container: {},
  formContainer: {
    // flex: 1,
    // justifyContent: 'flex-start',
  },
  error: {
    marginBottom: 5,
  },
});

// export default Form;
export default React.memo(Form);
