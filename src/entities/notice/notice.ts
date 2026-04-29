export interface Notice {
  noticeId: string;
  title: string; //'이번주 근무표 안내';
  content: string; // '이번주 근무표를 확인해주세요.';
  isPublic: boolean;
}
