import { apiClient } from '@/src/shared/api/api';

export async function getDashboardInfos(storeId: string) {
  return await apiClient.get(`/stores/${storeId}/dashboard/staff`);
}
