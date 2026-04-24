import { apiClient } from '@/src/shared/api/api';
import {
  SignInRequest,
  SignUpRequest,
  SocialLoginRequest,
} from '../model/sign';

export async function signUp(data: SignUpRequest) {
  return await apiClient.post('/auth/signup', data);
}

export async function socialLogin(data: SocialLoginRequest) {
  return await apiClient.post('/auth/google', data);
}

export async function signIn(data: SignInRequest) {
  return await apiClient.post('/auth/login', data);
}

export async function signOut() {}
