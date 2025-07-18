import { StarItem } from "@/api/ratingApi";
import theme from "@/styles/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import Star from "./Star";

export interface RatingViewProps {
  stars: StarItem[];
  onStarPress?: (index: number) => void;
  disabled?: boolean;
}
const RatingView = ({ onStarPress, stars, disabled }: RatingViewProps) => {
  return (
    <View style={styles.ratingContainer}>
      {stars &&
        stars.map((i) => (
          <Star
            key={i.index}
            selected={i.selected}
            index={i.index}
            onPress={disabled ? undefined : onStarPress}
          />
        ))}
    </View>
  );
};

export default React.memo(RatingView);

const styles = StyleSheet.create({
  modal: {
    // justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: 10,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    ...theme.styles.scale.h5,
    color: theme.colors.salmon,
    marginBottom: 5,
    fontWeight: "600",
  },
  body: {
    // ...theme.styles.scale.h6,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    // paddingVertical: 20,
    // paddingBottom: 30,
  },
  textArea: {
    // flex: 1,
    marginBottom: 10,
    height: 100,
    textAlignVertical: "top",
  },
  error: {
    // borderColor: theme.colors.salmon,
    // borderWidth: 1,
  },
});
