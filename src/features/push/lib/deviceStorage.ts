import * as SecureStore from 'expo-secure-store';

const DEVICE_ID_KEY = 'pushDeviceId';
const EXPO_PUSH_TOKEN_KEY = 'expoPushToken';

export async function savePushDeviceId(deviceId: string): Promise<void> {
  await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
}

export async function getPushDeviceId(): Promise<string | null> {
  return await SecureStore.getItemAsync(DEVICE_ID_KEY);
}

export async function clearPushDeviceId(): Promise<void> {
  await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
}

export async function saveExpoPushToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(EXPO_PUSH_TOKEN_KEY, token);
}

export async function getExpoPushToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(EXPO_PUSH_TOKEN_KEY);
}

export async function clearExpoPushToken(): Promise<void> {
  await SecureStore.deleteItemAsync(EXPO_PUSH_TOKEN_KEY);
}
