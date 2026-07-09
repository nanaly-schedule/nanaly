export interface Notice {
  id: string;
  noticeId?: string;
  title: string; //'이번주 근무표 안내';
  content?: string | null; // '이번주 근무표를 확인해주세요.';
  isPublic?: boolean | string | number;
  isPrivate?: boolean | string | number;
  public?: boolean | string | number;
  private?: boolean | string | number;
  visibility?: string;
  type?: string;
  scope?: string;
  noticeType?: string;
  authorName?: string;
  createdAt?: string;
  isRead?: boolean;
}
