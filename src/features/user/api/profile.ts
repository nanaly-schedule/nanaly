import { apiClient } from '@/src/shared/api/api';
import { UserProfileRequest, UserProfileResponse } from '../model/profile';
import { AxiosResponse } from 'axios';

export async function getUserProfile(): Promise<
  AxiosResponse<UserProfileResponse, any, {}>
> {
  return await apiClient.get('/user/profile');
}

export async function updateUserProfile(data: UserProfileRequest) {
  return await apiClient.patch('/user/profile', data);
}
