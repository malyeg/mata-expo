import { theme } from "@/styles/theme";
import { StyleSheet } from "react-native";

/**
 * Shared styles for picker modal components
 */
export const pickerStyles = StyleSheet.create({
  modal: {},
  searchInput: {},
  flatList: {
    flex: 1,
  },
  noData: {
    flex: 0.75,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
  chevron: {
    color: theme.colors.green,
  },
});

/**
 * MultiSelectPickerModal specific styles
 */
export const multiSelectStyles = StyleSheet.create({
  selectAll: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.lightGrey,
  },
  allLabel: {
    fontWeight: "bold",
  },
});

