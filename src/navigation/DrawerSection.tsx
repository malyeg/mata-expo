import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from '../components/core';
import Icon from '../components/core/Icon';
import theme from '../styles/theme';

interface DrawerSectionProps {
  label: string;
  children: any;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}
const DrawerSection = ({label, style, icon, children}: DrawerSectionProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {icon ? (
          <Icon
            name={icon}
            size={20}
            color={theme.colors.dark}
            style={styles.emptyIcon}
          />
        ) : (
          <View style={styles.emptyIcon} />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

export default DrawerSection;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
  },
  header: {
    flexDirection: 'row',
  },
  label: {
    // color: theme.colors.salmon,
    fontWeight: theme.fontWeight.semiBold,
    ...theme.styles.scale.body1,
  },
  body: {
    paddingLeft: 20,
  },
  emptyIcon: {
    marginRight: 10,
  },
});
