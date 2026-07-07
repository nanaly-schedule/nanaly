import { AxiosResponse } from 'axios';

import { apiClient } from '@/src/shared/api/api';

import NotificationResponse, {
  NotificationSettingsRequest,
  NotificationSettingsResponse,
} from '../model/notification';

export async function getNotifications(params: {
  storeId: string;
}): Promise<AxiosResponse<NotificationResponse[]>> {
  return apiClient.get('/notifications', {
    params,
  });
}

export async function readNotification(id: string) {
  return apiClient.patch(`/notifications/${id}/read`);
}

export async function getNotificationSettings(): Promise<
  AxiosResponse<NotificationSettingsResponse>
> {
  return apiClient.get('/notifications/settings');
}
export async function setNotificationSettings(
  data: NotificationSettingsRequest,
): Promise<AxiosResponse<NotificationSettingsResponse>> {
  return apiClient.patch('/notifications/settings', data);
}
