import React, {FC} from 'react';

import {Switch, SwitchProps} from 'react-native';
import create from '../../styles/EStyleSheet';

const AppSwitch: FC<SwitchProps> = ({...props}) => {
  return (
    <Switch
      {...props}
      trackColor={{false: '#767577', true: '#81b0ff'}}
      thumbColor={props.value ? '#f5dd4b' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      style={[styles.container, props.style]}
    />
  );
};

const styles = create({
  container: {},
});

export default React.memo(AppSwitch);
