import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, Separator } from "../core";

type AppMenuProps = {
  children: React.ReactNode;
};
const AppMenu = ({ children }: AppMenuProps) => {
  const [visible, setVisible] = React.useState(false);
  const { t } = useLocale("common");
  const { bottom } = useSafeAreaInsets();
  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = React.useCallback(() => {
    setVisible(false);
  }, [visible]);

  // Clone children and pass closeMenu function to each child
  const childrenWithProps = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    const result: React.ReactNode[] = [];

    childrenArray.forEach((child, index) => {
      if (React.isValidElement(child)) {
        const clonedChild = React.cloneElement(child, {
          closeMenu,
        } as Record<string, unknown>);
        result.push(clonedChild);

        // Add divider after each child except the last one
        if (index < childrenArray.length - 1) {
          result.push(
            <Separator
              style={{ marginVertical: 5 }}
              key={`menu-divider-${child.key ?? index}`}
            />
          );
        }
      }
    });

    return result;
  }, [children, closeMenu]);

  return (
    <>
      <Pressable hitSlop={10} onPress={openMenu}>
        <MaterialCommunityIcons
          name="dots-vertical"
          justifyContent="center"
          alignItems="center"
          size={24}
          color={theme.colors.dark}
        />
      </Pressable>
      <Modal
        title={t("appMenu.modalOptionsTitle")}
        isVisible={visible}
        onBackdropPress={closeMenu}
        onClose={closeMenu}
        containerStyle={[
          styles.modalContentContainer,
          {
            paddingBottom: bottom + 50,
          },
        ]}
      >
        {childrenWithProps}
        {/* <Text>Menu</Text> */}
      </Modal>
    </>
  );
};

export default AppMenu;

const styles = StyleSheet.create({
  modalContentContainer: { paddingTop: 20, gap: 10 },
});
