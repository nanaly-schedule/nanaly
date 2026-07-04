import { AxiosResponse } from 'axios';

import { apiClient } from '@/src/shared/api/api';

import NotificationResponse from '../model/notification';

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
