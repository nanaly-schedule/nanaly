import { apiClient } from '@/src/shared/api/api';

export async function createInviteCode(storeId: string) {
  return apiClient.post(`/stores/${storeId}/invitations`);
}
