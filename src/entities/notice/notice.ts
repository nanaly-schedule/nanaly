export interface Notice {
  id: string;
  noticeId?: string;
  title: string; //'이번주 근무표 안내';
  content?: string | null; // '이번주 근무표를 확인해주세요.';
  isPublic: boolean;
  authorName?: string;
  createdAt?: string;
  isRead?: boolean;
}
