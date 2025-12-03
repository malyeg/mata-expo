import itemsApi, { Item } from "@/api/itemsApi";
import profilesApi from "@/api/profileApi";
import { Loader, Screen } from "@/components/core";
import DataList from "@/components/widgets/DataList";
import ItemCard from "@/components/widgets/ItemCard";
import ProfileCard from "@/components/widgets/ProfileCard";
import { useFirestoreQuery } from "@/hooks/db/useFirestoreQuery";
import { Profile } from "@/models/Profile.model";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const UserItemsScreen = () => {
  const params = useLocalSearchParams<{
    id: string;
  }>();
  const [profile, setProfile] = useState<Profile | undefined>();

  const { data: items, loading } = useFirestoreQuery<Item>(
    itemsApi.collectionName,
    (ref) => {
      return ref
        .where("user.id", "==", params?.id)
        .where("status", "==", "online");
    }
  );

  useEffect(() => {
    const loadData = async () => {
      const freshProfile = await profilesApi.getById(params?.id);
      if (freshProfile) {
        setProfile(freshProfile);
      }
    };
    loadData();
  }, [params?.id]);

  const renderItem = ({ item }: any) => (
    <ItemCard style={styles.card} item={item as Item} />
  );

  return (
    <Screen scrollable={false} style={styles.screen}>
      {profile && <ProfileCard profile={profile} />}
      {!loading && !!items ? (
        <DataList
          showsVerticalScrollIndicator={false}
          data={{ items }}
          columnWrapperStyle={styles.columnWrapper}
          numColumns={2}
          renderItem={renderItem}
          //   itemSize={ITEM_CARD_HEIGHT}
        />
      ) : (
        <Loader />
      )}
    </Screen>
  );
};

export default UserItemsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  datalist: { flex: 1 },
  categories: {
    marginVertical: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    flexBasis: "48%",
  },
  filter: {
    marginLeft: 20,
  },
});
