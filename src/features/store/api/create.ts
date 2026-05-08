import { apiClient } from '@/src/shared/api/api';

import { StoresRequest } from '../model/create';

export async function createStore(data: StoresRequest) {
  return await apiClient.post('/stores', data);
}
