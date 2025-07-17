import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import useNavigationHelper from '../../hooks/useNavigationHelper';
import {EDIT_PROFILE_SCREEN_NAME} from '../../screens/EditProfileScreen';
import theme from '../../styles/theme';
import {Button, Icon, Text} from '../core';

interface UpdateProfileCardProps {
  style?: StyleProp<ViewStyle>;
}
const UpdateProfileCard = ({style}: UpdateProfileCardProps) => {
  const {navigation} = useNavigationHelper();
  const openEditProfileScreen = () => {
    navigation.navigate(EDIT_PROFILE_SCREEN_NAME);
  };
  return (
    <View style={[styles.container, style]}>
      <Icon
        name="alert-circle"
        style={styles.alertIcon}
        color={theme.colors.pictonBlue}
        bgColor={'red'}
      />
      <View style={styles.updateTextContainer}>
        <Text style={styles.updateText}>
          Complete your profile for better experience
        </Text>
      </View>
      <View>
        <Button
          title="Update"
          style={styles.updateButton}
          textStyle={styles.updateButtonText}
          onPress={openEditProfileScreen}
        />
      </View>
    </View>
  );
};

export default React.memo(UpdateProfileCard);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 7,
    borderWidth: 1,
    height: 45,
    alignContent: 'space-between',
    alignItems: 'center',

    borderColor: theme.colors.pictonBlue,
    backgroundColor: theme.colors.lightPictonBlue,
    paddingHorizontal: 2,
  },
  updateTextContainer: {
    flex: 1,
  },
  updateText: {
    // textAlign: 'center',
    color: theme.colors.dark,
    fontSize: 12,
  },
  alertIcon: {
    marginRight: 5,
  },
  updateButton: {
    height: 30,
    backgroundColor: theme.colors.pictonBlue,
  },
  updateButtonText: {
    fontSize: 12,
    marginHorizontal: 10,
  },
});
