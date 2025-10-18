import HeaderBack from "@/components/HeaderBack";
import theme from "@/styles/theme";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const useScreenOptions = (): NativeStackNavigationOptions => {
  const { bottom } = useSafeAreaInsets();
  const screenOptions: NativeStackNavigationOptions = {
    headerTitleStyle: {
      fontSize: 25,
      fontWeight: "bold",
      color: theme.colors.salmon,
    },
    headerShadowVisible: false,
    headerStyle: {},
    contentStyle: {
      paddingBottom: bottom,
      backgroundColor: theme.colors.white,
    },
    headerLeft: () => <HeaderBack />,
  };

  return screenOptions;
};

export default useScreenOptions;
