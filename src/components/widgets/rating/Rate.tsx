import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../core';
import Star from './Star';

interface RateProps {
  value: number;
  type?: 'count' | 'stars';
  starsCount?: number;
  starSize?: number;
}
const Rate = ({
  value,
  type = 'count',
  starsCount = 5,
  starSize = 20,
}: RateProps) => {
  return (
    <View style={styles.container}>
      {type === 'count' ? (
        <>
          <Text>{value.toFixed(1)}</Text>
          <Star index={0} selected size={starSize} />
        </>
      ) : (
        <>
          {Array(starsCount)
            .fill(0)
            .map((v, i) => (
              <Star size={starSize} index={v} selected={i < value} />
            ))}
        </>
      )}
    </View>
  );
};

export default React.memo(Rate);

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
});
