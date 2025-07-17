import {useLinkTo} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {goBack} from '../../navigation/NavigationHelper';
import theme from '../../styles/theme';
import {Icon} from '../core';
import PressableOpacity from '../core/PressableOpacity';

interface HeaderNavProps {
  style: ViewStyle;
  navigation: any;
  route: any;
}
const HeaderNav = ({navigation, route, style}: HeaderNavProps) => {
  // const navigation = useNavigation<
  //   StackNavigationHelpers | DrawerNavigationHelpers
  // >();
  const linkTo = useLinkTo();
  const onPressHandler = useCallback(() => {
    goBack({navigation, route, linkTo});
  }, [linkTo, navigation, route]);
  return (
    <PressableOpacity
      onPress={onPressHandler}
      style={[styles.container, style]}>
      <Icon name="chevron-left" color={theme.colors.grey} size={35} />
    </PressableOpacity>
  );
};

export default React.memo(HeaderNav);

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
