import React, { FC, useEffect } from "react";
import { ImageBackground, ImageStyle, StyleProp } from "react-native";
import create from "../../styles/EStyleSheet";
import theme from "../../styles/theme";
import Image from "./Image";

const logo = require("@/assets/images/logo.png");
const bgImage = require("@/assets/images/bg.png");
interface LogoProps {
  size?: number;
  backgroundColor?: string;
  title?: string;
  showTitle?: boolean;
  lastRefresh?: Date;
  style: StyleProp<ImageStyle>;
  showBackgroundImage?: boolean;
}

const Logo: FC<LogoProps> = ({
  size = 100,
  showBackgroundImage,
  // backgroundColor = '',
  lastRefresh,
  style,
}) => {
  useEffect(() => {}, [lastRefresh]);

  return showBackgroundImage ? (
    <ImageBackground
      style={styles.bgImageContainer}
      source={bgImage}
      resizeMode="stretch"
    >
      <Image
        style={[
          styles.logoContainer,
          {
            width: size,
            height: size,
          },
          style,
        ]}
        contentFit={"contain"}
        source={logo}
      />
    </ImageBackground>
  ) : (
    <Image
      style={[
        styles.logoContainer,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      contentFit={"contain"}
      source={logo}
    />
  );
};

const styles = create({
  bgImageContainer: {
    // flex: 1,
    width: 300,
    // height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  logoContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(Logo);
