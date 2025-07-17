import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import {BaseViewProps} from '../../types/ReactTypes';
import theme from '../../styles/theme';

interface AppInfoProps extends BaseViewProps {}
const AppInfo = ({style}: AppInfoProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text>{DeviceInfo.getBuildNumber()}</Text>
    </View>
  );
};

export default AppInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.grey,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
