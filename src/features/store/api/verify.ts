import { apiClient } from '@/src/shared/api/api';

import { VerifyBusinessRequest } from '../model/verify';

export async function verifyBusiness(data: VerifyBusinessRequest) {
  return await apiClient.post('/stores/verify-business', data);
}
