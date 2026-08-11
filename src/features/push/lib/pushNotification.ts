import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  registerDevice,
  unregisterDevice,
} from '@/src/features/push/api/device';

import {
  clearExpoPushToken,
  clearPushDeviceId,
  getExpoPushToken,
  getPushDeviceId,
  saveExpoPushToken,
  savePushDeviceId,
} from './deviceStorage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let permissionRequestAttempted = false;
let permissionRequestPromise: Promise<string> | null = null;
let pushPreparationPromise: Promise<string | null> | null = null;

async function getNotificationPermissionStatus() {
  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.status === 'granted') {
    return permissions.status;
  }

  if (permissionRequestPromise) {
    return permissionRequestPromise;
  }

  if (permissionRequestAttempted) {
    return permissions.status;
  }

  permissionRequestAttempted = true;
  permissionRequestPromise = Notifications.requestPermissionsAsync().then(
    (requestedPermissions) => requestedPermissions.status,
  );

  try {
    return await permissionRequestPromise;
  } finally {
    permissionRequestPromise = null;
  }
}

async function getExpoPushTokenAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    return null;
  }

  const finalStatus = await getNotificationPermissionStatus();

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    return null;
  }

  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}

async function preparePushNotifications() {
  const expoPushToken = await getExpoPushTokenAsync();

  if (!expoPushToken) {
    return null;
  }

  const [savedDeviceId, savedExpoPushToken] = await Promise.all([
    getPushDeviceId(),
    getExpoPushToken(),
  ]);

  if (savedDeviceId && savedExpoPushToken === expoPushToken) {
    return expoPushToken;
  }

  if (savedDeviceId && savedExpoPushToken && savedExpoPushToken !== expoPushToken) {
    try {
      await unregisterDevice(savedDeviceId);
    } catch {}
  }

  try {
    const response = await registerDevice({
      expoPushToken,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
      deviceName: Device.deviceName ?? Device.modelName ?? 'Unknown device',
    });

    const deviceId = response.data?.id;
    if (deviceId) {
      await Promise.all([
        savePushDeviceId(deviceId),
        saveExpoPushToken(expoPushToken),
      ]);
    }
  } catch {}

  return expoPushToken;
}

export async function preparePushNotificationsAsync() {
  if (pushPreparationPromise) {
    return pushPreparationPromise;
  }

  pushPreparationPromise = preparePushNotifications();

  try {
    return await pushPreparationPromise;
  } finally {
    pushPreparationPromise = null;
  }
}

export async function unregisterCurrentDeviceAsync() {
  const deviceId = await getPushDeviceId();

  if (!deviceId) {
    return;
  }

  try {
    await unregisterDevice(deviceId);
  } catch {
  } finally {
    await Promise.all([clearPushDeviceId(), clearExpoPushToken()]);
  }
}
