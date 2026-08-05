import { apiClient } from '@/src/shared/api/api';

import { RefreshTokenRequest } from '../model/token';

export async function refreshToken(data: RefreshTokenRequest) {
  return await apiClient.post('/auth/refresh', data);
}
