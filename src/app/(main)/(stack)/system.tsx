import { Button, Screen, Text } from "@/components/core";
import Card from "@/components/core/Card";
import useAuth from "@/hooks/useAuth";
import useLocation from "@/hooks/useLocation";
import useSocial from "@/hooks/useSocial";
import { theme } from "@/styles/theme";
import storageApi from "@/utils/StorageApi";
import { useNetInfo } from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import * as Application from "expo-application";
import * as Device from "expo-device";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

// Declare HermesInternal for type checking
declare const HermesInternal: object | undefined;

interface DeviceData {
  deviceType: string;
  manufacturer: string | null;
  modelName: string | null;
  osName: string | null;
  osVersion: string | null;
  brand: string | null;
  modelId: string | null;
  bundleId: string | null;
  buildNumber: string | null;
  version: string | null;
}

const SystemScreen = () => {
  const [data, setData] = useState<DeviceData>({
    deviceType: "",
    manufacturer: null,
    modelName: null,
    osName: null,
    osVersion: null,
    brand: null,
    modelId: null,
    bundleId: null,
    buildNumber: null,
    version: null,
  });

  const netInfo = useNetInfo();
  const locationInfo = useLocation();
  const { share } = useSocial();
  const { signOut } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      // Get device info using expo-device
      const deviceType = Device.deviceType
        ? Device.DeviceType[Device.deviceType]
        : "Unknown";
      const manufacturer = Device.manufacturer;
      const modelName = Device.modelName;
      const osName = Device.osName;
      const osVersion = Device.osVersion;
      const brand = Device.brand;
      const modelId = Device.modelId;

      // Get app info using expo-application
      const bundleId = Application.applicationId;
      const buildNumber = Application.nativeBuildVersion;
      const version = Application.nativeApplicationVersion;

      const newData: DeviceData = {
        deviceType,
        manufacturer,
        modelName,
        osName,
        osVersion,
        brand,
        modelId,
        bundleId,
        buildNumber,
        version,
      };

      setData(newData);
    };

    loadData();
  }, []);

  const handleShare = () => {
    share(JSON.stringify(data, null, 2));
  };

  const clearStorage = () => {
    Alert.alert(
      "Warning",
      "All storage will be deleted and you will be signed out",
      [
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              await storageApi.clear();
            }
          },
        },
        {
          text: "Cancel",
        },
      ]
    );
  };

  const testCrash = () => {
    Sentry.captureException(new Error("Test crash from System Screen"));
    Alert.alert("Crash Reported", "A test crash has been sent to Sentry");
  };

  return (
    <Screen scrollable>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Hermes: {String(typeof HermesInternal !== "undefined")}
          </Text>
          <Text style={styles.cardTitle}>Device</Text>
          <Text>deviceType: {data.deviceType}</Text>
          <Text>modelId: {data.modelId}</Text>
          <Text>manufacturer: {data.manufacturer}</Text>
          <Text>modelName: {data.modelName}</Text>
          <Text>osName: {data.osName}</Text>
          <Text>osVersion: {data.osVersion}</Text>
          <Text>brand: {data.brand}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>App</Text>
          <Text>bundleId: {data.bundleId}</Text>
          <Text>buildNumber: {data.buildNumber}</Text>
          <Text>version: {data.version}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Connection</Text>
          <Text>type: {netInfo?.type}</Text>
          <Text>connected: {netInfo?.isConnected?.toString()}</Text>
          <Text>
            internetReachable: {netInfo?.isInternetReachable?.toString()}
          </Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Location</Text>
          <Text>hasPermission: {locationInfo.hasPermission?.toString()}</Text>
          <Text>connected: {locationInfo.connected?.toString()}</Text>
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <Button title="Share Info" onPress={handleShare} />
        <Button title="Clear Storage" onPress={clearStorage} />
        <Button title="Test Crash" onPress={testCrash} />
      </View>
    </Screen>
  );
};

export default SystemScreen;

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "baseline",
    marginBottom: 10,
    padding: 10,
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  cardTitle: {
    alignSelf: "center",
    fontSize: 18,
    color: theme.colors.salmon,
    fontWeight: "500",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
});
