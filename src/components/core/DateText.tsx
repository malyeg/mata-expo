import { patterns } from "@/config/constants";
import { format } from "date-fns";
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import Text from "./Text";
interface DateTextProps {
  date: Date;
  pattern?: string;
  style?: StyleProp<TextStyle>;
}
const DateText = ({ pattern = patterns.DATE, date, style }: DateTextProps) => {
  return <Text style={style}>{format(date, pattern)}</Text>;
};

export default React.memo(DateText);
