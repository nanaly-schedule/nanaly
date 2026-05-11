import { apiClient } from '@/src/shared/api/api';

import { StoreInfoRequest, StoresRequest } from '../model/store';

export async function createStore(data: StoresRequest) {
  return await apiClient.post('/stores', data);
}

export async function getStore(storeId: string) {
  return await apiClient.get(`/stores/${storeId}`);
}

export async function updateStore(storeId: string, data: StoreInfoRequest) {
  return await apiClient.patch(`/stores/${storeId}`, data);
}

export async function deleteStore(storeId: string) {
  return await apiClient.delete(`/stores/${storeId}`);
}

export async function getMyStore() {
  return await apiClient.get('/stores/me');
}
