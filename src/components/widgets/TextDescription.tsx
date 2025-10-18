import useLocale from "@/hooks/useLocale";
import theme from "@/styles/theme";
import React, { useCallback, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Text } from "../core";

interface TextDescriptionProps extends TextProps {
  maxLines?: number;
  children: any;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}
const TextDescription = ({
  children,
  maxLines = 2,
  style,
}: TextDescriptionProps) => {
  const { t } = useLocale("components");
  const [textShown, setTextShown] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(
    (e) => {
      setShowMore(e.nativeEvent.lines.length >= maxLines);
    },
    [maxLines]
  );

  return (
    <>
      <Text
        style={[styles.text, style]}
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : maxLines}
      >
        {children}
      </Text>

      {showMore ? (
        <Text
          style={textShown ? styles.lessText : styles.moreText}
          onPress={toggleNumberOfLines}
        >
          {textShown
            ? t("textDescription.showLessTitle")
            : t("textDescription.showMoreTitle")}
        </Text>
      ) : null}
    </>
  );
};

export default React.memo(TextDescription);

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
  },
  moreText: {
    color: theme.colors.grey,
    textAlign: "right",
    marginBottom: 10,
  },
  lessText: {
    color: theme.colors.grey,
    textAlign: "right",
    marginBottom: 10,
  },
});
