import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
// import {Source} from 'react-native-fast-image';
import Images from '../../assets/images/intro';
import theme from '../../styles/theme';
import {Text} from '../core';
interface IntroSlideProps {
  index: number;
}
const IntroSlide = ({index = 1}: IntroSlideProps) => {
  const slide = Images[index];
  return (
    <View style={styles.container}>
      <Image source={slide.source} style={styles.image} />
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.body}>{slide.body}</Text>
    </View>
  );
};

export default IntroSlide;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    // flex: 1,
  },
  title: {
    ...theme.styles.scale.h4,
    textAlign: 'center',
    fontWeight: theme.fontWeight.bold,
  },
  body: {
    ...theme.styles.scale.h6,
    textAlign: 'center',
  },
});
