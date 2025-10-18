import {SvgProps} from 'react-native-svg';
import free from './free.svg';
import filter from './filter.svg';
import category from './category.svg';
import swap from './icSwap.svg';
import profile from './profile.svg';
import more from './more.svg';
import {CategoryIcons} from './categories';
import React from 'react';

interface SvgIconsType {
  [key: string]: React.FC<SvgProps>;
}
export const SvgIcons: SvgIconsType = {
  free,
  filter,
  category,
  swap,
  profile,
  more,
  ...CategoryIcons,
};
