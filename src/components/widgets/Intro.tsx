import profilesApi from "@/api/profileApi";
import Images from "@/assets/images/intro";
import theme from "@/styles/theme";
import Analytics from "@/utils/Analytics";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Pagination } from "react-native-snap-carousel";
import { Modal, Text } from "../core";
import Chevron from "../icons/Chevron";
import IntroSlide from "./IntroSlide";

interface IntroProps {
  onSkip: () => void;
}
const Intro = ({ onSkip }: IntroProps) => {
  const [isModalVisible, setModalVisible] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    Analytics.logEvent("tutorial_begin");
  }, []);

  const onSkipClick = useCallback(() => {
    setModalVisible(false);
    profilesApi.setFirstLoad(false);
    onSkip();
    Analytics.logEvent("tutorial_skip");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = useCallback(() => {
    setModalVisible(false);
    profilesApi.setFirstLoad(false);
    onSkip();
    Analytics.logEvent("tutorial_complete");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNext = useCallback(() => {
    if (activeSlide < 5) {
      setActiveSlide((as) => as + 1);
    }
    console.log(activeSlide);
  }, [activeSlide]);

  return (
    <Modal
      isVisible={isModalVisible}
      position="full"
      containerStyle={styles.modal}
    >
      <IntroSlide index={activeSlide} />
      <View style={styles.navContainer}>
        {activeSlide < 4 && <Chevron direction="left" onPress={onNext} />}
        <Pagination
          dotsLength={Images.length}
          activeDotIndex={activeSlide}
          // containerStyle={styles.PaginationContainer}
          // dotContainerStyle={styles.dotContainer}
          dotStyle={styles.paginationActiveDot}
          inactiveDotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          containerStyle={styles.paginationContainer}
        />
        {activeSlide < 4 && (
          <Pressable onPress={onSkipClick} hitSlop={10}>
            <Text>Skip</Text>
          </Pressable>
        )}
        {activeSlide === 4 && (
          <Pressable onPress={onClose} hitSlop={10}>
            <Text>Close</Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
};

export default React.memo(Intro);

const styles = StyleSheet.create({
  modal: {
    marginBottom: 10,
  },
  paginationContainer: {
    flexDirection: "row-reverse",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.grey,
  },
  paginationActiveDot: {
    width: 15,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.green,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  navButton: {
    // flexBasis: '48%',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
});
