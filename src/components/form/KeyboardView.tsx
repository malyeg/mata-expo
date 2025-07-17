import React, {FC} from 'react';
import {View, ViewProps} from 'react-native';
import useKeyboard from '../../hooks/useKeyboard';

interface KeyboardViewProps extends ViewProps {
  children: React.ReactNode;
}
const KeyboardView = ({...props}: KeyboardViewProps) => {
  const {keyboardShown} = useKeyboard();

  return !keyboardShown ? <View {...props}>{props.children}</View> : null;
};

export default React.memo(KeyboardView);
