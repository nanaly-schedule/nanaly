import { apiClient } from '@/src/shared/api/api';

export async function getMembers(storeId: string, search?: string) {
  const query = search ? `?search=${search}` : '';

  return await apiClient.get(`/stores/${storeId}/members${query}`);
}
