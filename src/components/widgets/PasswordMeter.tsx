import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import { BaseViewProps } from "@/types/ReactTypes";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../core";

type PasswordComplexity = "strong" | "medium" | "weak";
interface PasswordMeterProps extends BaseViewProps {
  password: string;
  onChange?: (complexity: PasswordComplexity) => void;
}

const strongPassword = new RegExp(
  //   /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/,
  /^(?=.*\d)(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/
);
const mediumPassword = new RegExp(/^(?=.*\d)(?=.*[a-z])([^\s]){8,}$/);

const PasswordMeter = ({ password, style }: PasswordMeterProps) => {
  const { t } = useLocale("widgets");
  const [complexity, setComplexity] = useState<
    PasswordComplexity | undefined
  >();
  useEffect(() => {
    if (!password) {
      setComplexity(undefined);
    } else if (strongPassword.test(password)) {
      setComplexity("strong");
    } else if (mediumPassword.test(password)) {
      setComplexity("medium");
    } else {
      setComplexity("weak");
    }
  }, [password]);

  return complexity ? (
    <View style={[styles.container, style]}>
      <View style={styles.barContainer}>
        {complexity === "strong" && <View style={[styles.strong]} />}

        {complexity === "medium" && (
          <View style={[styles.medium, styles.rightEdge]} />
        )}
        {complexity === "weak" && (
          <View style={[styles.weak, styles.rightEdge]} />
        )}
        <View style={styles.empty} />
      </View>
      <Text style={complexity === "strong" ? styles.strongText : undefined}>
        {complexity === "strong"
          ? t("passwordMeter.strong")
          : complexity === "medium"
          ? t("passwordMeter.medium")
          : t("passwordMeter.weak")}
      </Text>
    </View>
  ) : null;
};

export default React.memo(PasswordMeter);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barContainer: {
    flexBasis: "50%",
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    borderColor: theme.colors.lightGrey,
    backgroundColor: theme.colors.lightGrey,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  strong: {
    flex: 1,
    backgroundColor: theme.colors.green,
    // flexBasis: '33%',
  },
  medium: {
    // flex: 1,
    flexBasis: "66.66%",
    backgroundColor: theme.colors.yellow,
    // flexBasis: '33%',
  },
  weak: {
    flexBasis: "33.33%",
    backgroundColor: theme.colors.salmon,
    // flexBasis: '33%',
  },
  rightEdge: {
    borderRadius: 10,
  },
  empty: {
    backgroundColor: theme.colors.lightGrey,
    flexShrink: 1,
  },
  strongText: {
    color: theme.colors.green,
  },
});
