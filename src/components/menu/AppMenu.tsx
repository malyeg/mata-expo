import useLocale from "@/hooks/useLocale";
import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Modal, Separator } from "../core";

type AppMenuProps = {
  children: React.ReactNode;
};
const AppMenu = ({ children }: AppMenuProps) => {
  const [visible, setVisible] = React.useState(false);
  const { t } = useLocale("common");
  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = React.useCallback(() => {
    console.log("close menu", visible);
    setVisible(false);
  }, [visible]);

  useEffect(() => {
    console.log("menu visible", visible);
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
          result.push(<Separator key={`menu-divider-${child.key ?? index}`} />);
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
        onClose={closeMenu}
        containerStyle={styles.modalContentContainer}
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
