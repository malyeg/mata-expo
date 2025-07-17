import { Platform, StyleSheet } from "react-native";
import constants from "@/config/constants";
import theme from "./theme";

const sharedStyles = StyleSheet.create({
  text: {
    ...theme.styles.scale.body1,
    color: theme.colors.dark,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlignVertical: "center",
    // textAlign: 'center',
  },
  card: {
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.grey,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 1,
      },
      android: {
        shadowColor: theme.colors.grey,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        elevation: 3,
      },
    }),
  },
  shadowBox: {
    borderRadius: 5,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.grey,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
      },
      android: {
        shadowColor: theme.colors.grey,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        elevation: 3,
      },
    }),
  },
  redBox: {
    borderColor: "red",
    borderWidth: 1,
  },
  blueBox: {
    borderColor: "blue",
    borderWidth: 1,
  },
  yellowBox: {
    borderColor: "yellow",
    borderWidth: 1,
  },
  greenBtn: {
    backgroundColor: theme.colors.green,
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.green,
  },
  linkText: {
    ...theme.styles.scale.h5,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  textArea: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.medium,
    height: 40,
    borderWidth: 1,
    color: theme.colors.dark,
    borderColor: theme.colors.grey,
    borderRadius: 5,
  },
  tabbarLabel: {
    textTransform: "capitalize",
    ...theme.styles.scale.h6,
    color: theme.colors.dark,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
});

export default sharedStyles;
