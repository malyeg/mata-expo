import {ReactNode} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

export interface BaseViewProps {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}
