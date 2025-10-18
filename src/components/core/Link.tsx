import theme from "@/styles/theme";
import { Link as LinkBase } from "@react-navigation/native";
import React, { ComponentProps } from "react";
import { StyleSheet } from "react-native";

export type LinkBaseProps = ComponentProps<typeof LinkBase>;
export interface LinkProps extends LinkBaseProps {}
const Link = ({ ...props }: LinkProps) => {
  return (
    <LinkBase {...props} style={[styles.text, props.style]}>
      {props.children}
    </LinkBase>
  );
};

const styles = StyleSheet.create({
  text: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.green,
  },
});

export default React.memo(Link);
