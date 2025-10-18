import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../styles/theme";

interface TooltipProps {
  text: string;
  triangleSize?: 15;
  direction?: "top" | "bottom";
  positionFromLeft?: number;
}
const Tooltip = ({
  triangleSize = 15,
  text,
  direction = "top",
  positionFromLeft = 15,
}: TooltipProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.talkBubble}>
        <View style={styles.talkBubbleSquare}>
          <Text style={styles.talkBubbleMessage}>{text}</Text>
        </View>
        <View
          style={[
            styles.talkBubbleTriangle,
            {
              borderLeftWidth: triangleSize,
              borderRightWidth: triangleSize,
              borderBottomWidth: direction === "top" ? triangleSize : undefined,
              borderTopWidth: direction === "bottom" ? triangleSize : undefined,
              top: direction === "top" ? triangleSize * -1 : undefined,
              bottom: direction === "bottom" ? triangleSize * -1 : undefined,
              borderBottomColor:
                direction === "top" ? theme.colors.pictonBlue : undefined,
              borderTopColor:
                direction === "bottom" ? theme.colors.pictonBlue : undefined,
              left: positionFromLeft,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "yellow",
    // height: 50,
    zIndex: 2,
  },
  talkBubble: {
    backgroundColor: "transparent",
    position: "absolute",
  },
  talkBubbleSquare: {
    padding: 10,
    backgroundColor: theme.colors.pictonBlue,
    borderRadius: 10,
  },
  talkBubbleTriangle: {
    position: "absolute",
    // left: 15,
    width: 0,
    height: 0,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  talkBubbleMessage: {
    color: "#FFFFFF",
    // marginTop: 5,
    // marginLeft: 5,
    // marginRight: 5,
  },
});
