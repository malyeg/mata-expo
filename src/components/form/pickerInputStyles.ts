import { theme } from "@/styles/theme";
import { StyleSheet } from "react-native";

/**
 * Shared styles for picker input components (Picker and MultiSelectPicker)
 */
export const pickerInputStyles = StyleSheet.create({
  container: {},
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {},
  placeholderText: {
    color: theme.colors.grey,
  },
  label: {
    color: theme.colors.grey,
  },
  textInputBorder: {
    ...theme.styles.inputBorder,
  },
  textInputBorderError: {
    borderBottomColor: theme.colors.salmon,
    borderBottomWidth: 1,
  },
  pickerIcon: {
    marginRight: -6,
    flexShrink: 1,
    flexGrow: 0,
  },
  resetIcon: {
    flexGrow: 0,
    flexShrink: 1,
    marginLeft: 10,
  },
});

