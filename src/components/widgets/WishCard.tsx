import React, {useCallback, useMemo, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import categoriesApi from '../../api/categoriesApi';
import itemsApi from '../../api/itemsApi';
import listsApi, {ListItem} from '../../api/listsApi';
import {screens} from '../../config/constants';
import useNavigationHelper from '../../hooks/useNavigationHelper';
import theme, {colors} from '../../styles/theme';
import {Button, Icon, Image, Modal, Text} from '../core';
import Card from '../core/Card';

interface WishCardProps {
  listItem: ListItem;
  style?: StyleProp<ViewStyle>;
}

const WishCard = ({listItem}: WishCardProps) => {
  const {navigation} = useNavigationHelper();
  const [isVisible, setVisible] = useState(false);
  const onCardPress = useCallback(() => {
    if (listItem.isAvailable !== false) {
      navigation.navigate(screens.ITEM_DETAILS, {id: listItem.item.id});
    } else {
      setVisible(true);
    }
  }, [listItem.isAvailable, listItem.item.id, navigation]);
  const item = listItem.item;
  const imageUrl = itemsApi.getImageUrl(listItem.item);
  const category = useMemo(
    () => categoriesApi.getAll().find(c => c.id === item.category.id),
    [item.category.id],
  );

  const onShowPress = useCallback(() => {
    setVisible(false);
    navigation.navigate(screens.ITEMS, {categoryId: listItem.item.category.id});
  }, [listItem.item.category.id, navigation]);

  const deleteItem = useCallback(() => {
    listsApi.deleteById(listItem.id);
    setVisible(false);
  }, [listItem.id]);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <>
      <Card onPress={onCardPress} hideChevron={listItem.isAvailable === false}>
        <Image uri={imageUrl!} style={styles.image} />
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.categoryText}>{item.category?.name}</Text>
            <Text
              numberOfLines={1}
              style={styles.nameText}
              ellipsizeMode="tail">
              {item.name}
            </Text>
          </View>
          {listItem.isAvailable === false && (
            <Text style={styles.notAvailable}>Not available</Text>
          )}
        </View>
        {(!!item.category?.style?.iconName || !!category?.style?.iconName) && (
          <Icon
            name={item.category?.style?.iconName ?? category?.style?.iconName!}
            size={35}
            color={theme.colors.grey}
            style={styles.categoryIcon}
          />
        )}
      </Card>
      {listItem.isAvailable === false && (
        <Modal
          isVisible={isVisible}
          title={'Not available'}
          onClose={closeModal}
          containerStyle={styles.modal}>
          <View>
            <Text>Item is no longer available, show similar items?</Text>
            <View style={styles.modalButtonsContainer}>
              <Button
                title="Show similar"
                themeType="primary"
                style={styles.modalButton}
                onPress={onShowPress}
              />
              <Button
                title="Remove"
                themeType="white"
                style={styles.modalButton}
                onPress={deleteItem}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default React.memo(WishCard);

const styles = StyleSheet.create({
  image: {
    // flex: 0.8,
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryText: {
    ...theme.styles.scale.body1,
    color: theme.colors.grey,
  },
  nameText: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
    paddingVertical: 5,
  },
  descriptionText: {
    ...theme.styles.scale.body3,
    fontWeight: theme.fontWeight.semiBold,
    paddingBottom: 3,
  },
  freeImage: {
    position: 'absolute',
    right: 10,
  },
  swapIcon: {},
  categoryIcon: {
    position: 'absolute',
    bottom: 1,
    right: 10,
  },

  shimmerContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    // width: windowWidth,
    padding: 5,
  },
  shimmerImage: {
    width: 125,
    height: 125,
    borderRadius: 10,
  },
  notAvailable: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.orange,
    color: theme.colors.white,
    borderRadius: 5,
    padding: 5,
  },
  modal: {
    paddingVertical: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    // backgroundColor: 'grey',
  },
  modalButton: {
    flexBasis: '45%',
  },
});
