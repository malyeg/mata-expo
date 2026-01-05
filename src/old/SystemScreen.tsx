import {useNetInfo} from '@react-native-community/netinfo';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import DeviceInfo, {useBatteryLevel} from 'react-native-device-info';
import authApi from '../api/authApi';
import itemsSearchApi from '../api/search/itemsSearchApi';
import {Button, Screen, Text} from '../components/core';
import Card from '../components/core/Card';
import Header, {MenuItem} from '../components/widgets/Header';
import useLocation from '../hooks/useLocation';
import useNavigationHelper from '../hooks/useNavigationHelper';
import useSocial from '../hooks/useSocial';
import theme from '../styles/theme';
import storageApi from '../utils/StorageApi';
import crashlytics from '@react-native-firebase/crashlytics';

const SystemScreen = () => {
  const [data, setData] = useState<any>({});
  const batteryLevel = useBatteryLevel();
  const netInfo = useNetInfo();
  const locationInfo = useLocation();
  const {share} = useSocial();
  const {navigation} = useNavigationHelper();

  useEffect(() => {
    const loadData = async () => {
      console.log('system useEffect');
      const deviceName = await DeviceInfo.getDeviceType();
      const manufacturer = await DeviceInfo.getManufacturer();
      const model = await DeviceInfo.getModel();
      const androidId = await DeviceInfo.getAndroidId();
      let brand = DeviceInfo.getBrand();
      const deviceId = DeviceInfo.getDeviceId();

      const buildId = await DeviceInfo.getBuildId();
      const buildCode = await DeviceInfo.getBuildNumber();
      const version = await DeviceInfo.getVersion();
      const bundleId = DeviceInfo.getBundleId();

      const carrier = await DeviceInfo.getCarrier();
      const locationProviders =
        await DeviceInfo.getAvailableLocationProviders();

      const newData = {
        buildId,
        buildCode,
        version,
        carrier,
        locationProviders,
        deviceName,
        manufacturer,
        model,
        androidId,
        bundleId,
        brand,
        deviceId,
      };
      setData(newData);
      return newData;
    };
    loadData().then((d: any) => {
      const shareMenuItem: MenuItem = {
        label: 'share',
        icon: {name: 'share-variant', color: theme.colors.dark},
        onPress: () => {
          share(JSON.stringify(d));
        },
      };

      (navigation as any).setOptions({
        header: (props: any) => (
          <Header
            {...props}
            menu={{
              items: [shareMenuItem],
            }}
          />
        ),
      });
    });
  }, [navigation, share]);
  const clearStorage = () => {
    Alert.alert(
      'Warning',
      'All storage will be deleted and you will be signedout',
      [
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await authApi.signOut();
            } catch (error) {
              await storageApi.clear();
            }
          },
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };
  const clearCache = () => {
    itemsSearchApi.clearCache();
  };
  return (
    <Screen scrollable>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Hermes: {!!global.HermesInternal}</Text>
        <Text style={styles.cardTitle}>Device</Text>
        <Text>deviceName: {data.deviceName}</Text>
        <Text>deviceId: {data.deviceId}</Text>
        <Text>manufacturer: {data.manufacturer}</Text>
        <Text>model: {data.model}</Text>
        <Text>androidId: {data.androidId}</Text>
        <Text>brand: {data.brand}</Text>
        <Text>batteryLevel: {batteryLevel}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>App</Text>
        <Text>bundleId: {data.bundleId}</Text>
        <Text>buildNumber: {data.buildCode}</Text>
        <Text>version: {data.version}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Network</Text>
        <Text>carrier: {data.carrier}</Text>
        <Text>providers: {JSON.stringify(data.locationProviders)}</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Connection</Text>
        <Text>type: {netInfo?.type}</Text>
        <Text>connected: {netInfo?.isConnected?.toString()}</Text>
        <Text>
          internetReachable: {netInfo?.isInternetReachable?.toString()}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        <Text>hasPermission: {locationInfo.hasPermission?.toString()}</Text>
        <Text>connected: {locationInfo.connected.toString()}</Text>
      </Card>
      <View>
        <Button title="clear storage" onPress={clearStorage} />
        <Button title="clear cache" onPress={clearCache} />
      </View>
      <Button title="Test Crash" onPress={() => crashlytics().crash()} />
    </Screen>
  );
};

export default SystemScreen;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    marginBottom: 5,
    // padding: 40,
  },
  cardTitle: {
    alignSelf: 'center',
    fontSize: 18,
    color: theme.colors.salmon,
    fontWeight: '500',
  },
});
