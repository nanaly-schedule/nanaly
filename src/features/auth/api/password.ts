import { apiClient } from '@/src/shared/api/api';
import { ResetPasswordRequest } from '../model/password';

export async function resetPassword(data: ResetPasswordRequest) {
  return await apiClient.post('auth/reset-password', data);
}
