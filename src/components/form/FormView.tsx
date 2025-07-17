import React, { FC } from "react";
import { KeyboardAvoidingView, View, ViewProps } from "react-native";
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import create from "@/styles/EStyleSheet";

interface FormViewProps extends ViewProps {
  behavior?: "padding" | "height" | "position" | undefined;
  disableKeyboardAvoiding?: boolean;
  children: React.ReactNode;
}

const FormView: FC<FormViewProps> = ({
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
    <View style={[styles.formContainer, props.style]}>{props.children}</View>
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
export default React.memo(FormView);
