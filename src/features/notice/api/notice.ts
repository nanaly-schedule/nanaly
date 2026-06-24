import { apiClient } from '@/src/shared/api/api';

export type NoticeFilter = 'public' | 'private';

type NoticeRequest = {
  title: string;
  content: string;
  isPublic: boolean;
};

// 공지 목록 조회
export function getNotices(
    storeId: string,
    filter?: NoticeFilter
) {
  return apiClient.get(`/stores/${storeId}/notices`, {
    params: filter ? { filter } : undefined,
  });
}

// 공지 작성
export function createNotice(
    storeId: string,
    data: NoticeRequest
) {
  return apiClient.post(`/stores/${storeId}/notices`, data);
}

// 공지 상세 조회
export function getNotice(
    storeId: string,
    noticeId: string
) {
  return apiClient.get(`/stores/${storeId}/notices/${noticeId}`);
}

// 공지 수정
export function updateNotice(
  storeId: string,
  noticeId: string,
  data: NoticeRequest,
) {
  return apiClient.patch(
    `/stores/${storeId}/notices/${noticeId}`,
    data,
  );
}

// 공지 삭제
export function deleteNotice(
    storeId: string,
    noticeId: string
) {
  return apiClient.delete(
    `/stores/${storeId}/notices/${noticeId}`,
  );
}
