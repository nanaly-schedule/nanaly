import { apiClient } from '@/src/shared/api/api';

import { UpdateMemberRequest } from '../model/member';

export async function getMembers(storeId: string, search?: string) {
  const query = search ? `?search=${search}` : '';

  return await apiClient.get(`/stores/${storeId}/members${query}`);
}

export async function deleteMember(storeId: string, memberId: string) {
  return await apiClient.delete(`/stores/${storeId}/members/${memberId}`);
}

export async function getMember(storeId: string, memberId: string) {
  return await apiClient.get(`/stores/${storeId}/members/${memberId}`);
}

export async function updateMember(
  storeId: string,
  memberId: string,
  data: UpdateMemberRequest,
) {
  return await apiClient.patch(`/stores/${storeId}/members/${memberId}`, data);
}
