import { apiClient } from '@/src/shared/api/api';

interface RegisterDeviceRequest {
  expoPushToken: string;
  platform: 'ios' | 'android';
  deviceName: string;
}

interface RegisterDeviceResponse {
  message: string;
  id: string;
}

export async function registerDevice(data: RegisterDeviceRequest) {
  return await apiClient.post<RegisterDeviceResponse>('/user/devices', data);
}

export async function unregisterDevice(deviceId: string) {
  return await apiClient.delete(`/user/devices/${deviceId}`);
}
