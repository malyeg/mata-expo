import { create } from "@/styles/EStyleSheet";
import theme from "@/styles/theme";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  View,
} from "react-native";

export interface ScreenProps extends ScrollViewProps {
  scrollable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  bounces?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
  children: React.ReactNode;
}

const Screen = ({
  style,
  scrollable = false,
  refreshable = false,
  onRefresh,
  bounces = true,
  keyboardShouldPersistTaps = "never",
  children,
  ...props
}: ScreenProps) => {
  const refreshing = useState(false)[0];

  const onRefreshHandler = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return scrollable ? (
    <>
      <ScrollView
        {...props}
        bounces={bounces}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentContainerStyle={[styles.viewContainer, style]}
        scrollEnabled={true}
        refreshControl={
          refreshable ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefreshHandler}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </>
  ) : (
    <>
      <View style={[styles.viewContainer, style]}>{children}</View>
    </>
  );
};

const styles = create({
  viewContainer: {
    paddingHorizontal: theme.defaults.SCREEN_PADDING,
    paddingBottom: 5,
  },
});

export default React.memo(Screen);
