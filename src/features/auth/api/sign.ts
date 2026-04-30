import { apiClient } from '@/src/shared/api/api';

import {
  AppleLoginRequest,
  GoogleLoginRequest,
  SignInRequest,
  SignUpRequest,
} from '../model/sign';

export async function signUp(data: SignUpRequest) {
  return await apiClient.post('/auth/signup', data);
}

export async function googleLogin(data: GoogleLoginRequest) {
  return await apiClient.post('/auth/google', data);
}

export async function appleLogin(data: AppleLoginRequest) {
  return await apiClient.post('/auth/apple', data);
}

export async function signIn(data: SignInRequest) {
  return await apiClient.post('/auth/login', data);
}

export async function deleteUser() {
  return await apiClient.delete('/user');
}
