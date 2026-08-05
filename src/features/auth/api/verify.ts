import { apiClient } from '@/src/shared/api/api';

import { SendCodeRequest, VerifyCodeRequest } from '../model/verify';

export async function sendCode(data: SendCodeRequest) {
  return await apiClient.post('/auth/send-code', data);
}

export async function verifyCode(data: VerifyCodeRequest) {
  return await apiClient.post('/auth/verify-code', data);
}
