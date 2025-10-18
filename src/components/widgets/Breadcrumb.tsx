import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../core';

// const SEPARATOR = '=>';
interface BreadcrumbProps {
  path: string[];
}
interface CrumbProps {
  title: string;
  lastNode?: boolean;
}
const Breadcrumb = ({path}: BreadcrumbProps) => {
  return (
    <View style={styles.container}>
      {path.map((value, index) => (
        <Crumb title={value} lastNode={index === path.length - 1} />
      ))}
    </View>
  );
};

const Crumb = ({title, lastNode}: CrumbProps) => {
  return (
    <View style={styles.crumbContainer}>
      <View style={styles.crumbTextContainer}>
        <Text>{title}</Text>
      </View>
      {lastNode && <View style={styles.triangleRight} />}
    </View>
  );
};

export default React.memo(Breadcrumb);

const crumbTriangleSize = 50;
const crumbColor = 'red';

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
    flexDirection: 'row',
    // flex: 1,
  },
  crumbContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    // paddingHorizontal: 5,
    borderColor: 'grey',
    // borderWidth: 1,
    // paddingVertical: 8,
    // width: 100,
    backgroundColor: 'transparent',
  },
  leftTriangleContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  crumbTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: crumbColor,
    height: crumbTriangleSize,
  },
  arrow: {
    // width: 50,
    // height: 50,

    // border: 60px solid transparent
    // border-bottom: 60px solid transparent;

    // border-left: 60px solid green;
    // borderColor: 'transparent',
    borderBottomWidth: 2,
    borderLeftWidth: 60,

    borderLeftColor: 'green',
    borderColor: crumbColor,
    borderWidth: 2,
  },
  triangleRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: crumbTriangleSize,
    borderTopWidth: crumbTriangleSize / 2,
    borderBottomWidth: crumbTriangleSize / 2,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'red',
  },
});
