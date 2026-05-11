import { apiClient } from '@/src/shared/api/api';

export async function checkInviteCode(code: string) {
  return await apiClient.get(`/invite/${code}`);
}

export async function joinStoreWithInviteCode(code: string) {
  return await apiClient.post(`/invite/${code}/join`);
}
