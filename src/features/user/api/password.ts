import { apiClient } from '@/src/shared/api/api';

import { ChangePasswordRequest } from '../model/password';

export async function changePassword(data: ChangePasswordRequest) {
  return apiClient.patch('/user/password', data);
}
