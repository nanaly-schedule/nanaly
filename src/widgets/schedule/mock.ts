export type ScheduleViewType = 'mine' | 'all';

export type SchedulePosition = {
  id: string;
  name: string;
  color: string;
};

export type ScheduleMember = {
  id: string;
  name: string;
  roleName?: string;
};

export type ScheduleItem = {
  id: string;
  date: string;
  memberId: string;
  memberName: string;
  positionId?: string | null;
  positionName?: string | null;
  positionColor?: string | null;
  startTime: string;
  endTime: string;
  memo?: string;
  isMine?: boolean;
};

export const MOCK_POSITIONS: SchedulePosition[] = [
  { id: 'kitchen', name: '주방', color: '#60A5FA' },
  { id: 'hall', name: '홀', color: '#F6983B' },
  { id: 'counter', name: '카운터', color: '#46D81D' },
  { id: 'cleaning', name: '청소', color: '#8B7CF6' },
  { id: 'delivery', name: '포장', color: '#14B8A6' },
];

export const MOCK_MEMBERS: ScheduleMember[] = [
  { id: 'me', name: '이지현', roleName: '오너' },
  { id: 'kim', name: '김하늘', roleName: '설거지' },
  { id: 'lee', name: '이주아', roleName: '설거지' },
  { id: 'park', name: '박민서', roleName: '홀' },
  { id: 'choi', name: '최서윤', roleName: '주방' },
];

export const MOCK_SCHEDULES: ScheduleItem[] = [
  {
    id: 'schedule-1',
    date: '2026-06-09',
    memberId: 'me',
    memberName: '이지현',
    positionId: 'kitchen',
    positionName: '주방',
    positionColor: '#60A5FA',
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    id: 'schedule-2',
    date: '2026-06-10',
    memberId: 'kim',
    memberName: '김하늘',
    positionId: 'hall',
    positionName: '홀',
    positionColor: '#F6983B',
    startTime: '12:00',
    endTime: '18:00',
  },
  {
    id: 'schedule-3',
    date: '2026-06-18',
    memberId: 'lee',
    memberName: '이주아',
    positionId: 'counter',
    positionName: '카운터',
    positionColor: '#46D81D',
    startTime: '17:00',
    endTime: '22:00',
  },
  {
    id: 'schedule-4',
    date: '2026-06-18',
    memberId: 'park',
    memberName: '박민서',
    positionId: 'cleaning',
    positionName: '청소',
    positionColor: '#8B7CF6',
    startTime: '18:00',
    endTime: '23:00',
  },
  {
    id: 'schedule-5',
    date: '2026-06-19',
    memberId: 'me',
    memberName: '이지현',
    positionId: 'delivery',
    positionName: '포장',
    positionColor: '#14B8A6',
    startTime: '18:00',
    endTime: '23:00',
  },
  {
    id: 'schedule-6',
    date: '2026-06-24',
    memberId: 'choi',
    memberName: '최서윤',
    positionId: null,
    positionName: null,
    positionColor: null,
    startTime: '10:00',
    endTime: '23:00',
  },
];

export const MOCK_UNAVAILABLE_SCHEDULES: ScheduleItem[] = [
  {
    id: 'unavailable-1',
    date: '2026-06-13',
    memberId: 'me',
    memberName: '이지현',
    positionId: 'unavailable',
    positionName: '근무불가',
    positionColor: '#FF6B6B',
    startTime: '12:00',
    endTime: '17:00',
  },
  {
    id: 'unavailable-2',
    date: '2026-06-18',
    memberId: 'kim',
    memberName: '김하늘',
    positionId: 'unavailable',
    positionName: '근무불가',
    positionColor: '#FF6B6B',
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    id: 'unavailable-3',
    date: '2026-06-19',
    memberId: 'me',
    memberName: '이지현',
    positionId: 'unavailable',
    positionName: '근무불가',
    positionColor: '#FF6B6B',
    startTime: '19:00',
    endTime: '21:00',
  },
];
