import { apiClient } from '@/src/shared/api/api';

export type PositionResponse = {
  id?: string;
  positionId?: string;
  name?: string;
  positionName?: string;
  color?: string;
  positionColor?: string;
};

export type CreatePositionRequest = {
  name: string;
  color: string;
};

export async function getPositions(storeId: string) {
  return apiClient.get<PositionResponse[]>(`/stores/${storeId}/positions`);
}

export async function createPosition(
  storeId: string,
  data: CreatePositionRequest,
) {
  return apiClient.post<PositionResponse>(`/stores/${storeId}/positions`, data);
}

export async function deletePosition(storeId: string, positionId: string) {
  return apiClient.delete(`/stores/${storeId}/positions/${positionId}`);
}
