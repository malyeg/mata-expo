import configApi from "@/api/AppConfig";
import itemsApi, { Item } from "@/api/itemsApi";
import { Button, Loader, Modal, Text } from "@/components/core";
import { Error } from "@/components/form";
import useAuth from "@/hooks/useAuth";
import theme from "@/styles/theme";
import { addMilliseconds, isAfter } from "date-fns";
import { useRouter } from "expo-router";
import { default as React, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface InactiveItemModalProps {
  item: Item;
}
const InactiveItemModal = ({ item }: InactiveItemModalProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isVisible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const deleteItem = async () => {
    try {
      setError(null);
      setLoading(true);
      await itemsApi.delete(item);
      closeModal();
      router.back();
    } catch (err) {
      console.error(err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  const archiveItem = async () => {
    try {
      setError(null);
      setLoading(true);
      await itemsApi.archiveItem(item);
      closeModal();
      router.back();
    } catch (err) {
      console.error(err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  const refreshItem = async () => {
    try {
      setError(null);
      setLoading(true);
      const resp = await itemsApi.renewItem(item);
      closeModal();
    } catch (err) {
      console.error(err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => {
    setVisible(false);
  };

  useEffect(() => {
    const archiveDuration = configApi
      .getValue("item_archive_durationInMillis")
      .asNumber();
    const maxDate = addMilliseconds(item.timestamp!, archiveDuration);
    // const result = compareAsc(item.timestamp!, DataApi.getServerDate());
    if (archiveDuration > 0 && isAfter(maxDate, new Date())) {
      return;
    } else if (user?.id === item.user.id) {
      setVisible(true);
    }
  }, [item, user?.id]);

  return (
    <Modal isVisible={isVisible} title="Item Status" onClose={closeModal}>
      {!!error && <Error error={error} />}
      <Text h6 style={styles.subTitle1}>
        How’s your {item.name} doing? It’s been here for a while. 😊
      </Text>
      <Button
        title="I swapped it elsewhere"
        themeType="white"
        onPress={deleteItem}
        style={styles.b1}
      />
      <Button
        title="Refresh it"
        onPress={refreshItem}
        themeType="white"
        style={styles.b1}
      />
      <Button
        title="Archive it"
        themeType="white"
        style={styles.b1}
        onPress={archiveItem}
      />
      {loading && <Loader />}
    </Modal>
  );
};

export default InactiveItemModal;

const styles = StyleSheet.create({
  subTitle1: {
    textAlign: "center",
  },
  subTitle2: {
    textAlign: "center",
    marginTop: 10,
  },
  card: {},
  date: {
    ...theme.styles.scale.body2,
    color: theme.colors.grey,
  },
  title: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
  },
  body: {
    flexWrap: "wrap",
    marginRight: 25,
    ...theme.styles.scale.body2,
  },
  image: {
    flex: 1,
    marginBottom: 5,
    borderRadius: 10,
  },
  b1: {
    marginTop: 15,
  },
});
