import { createServer } from 'miragejs';

import { MemberRole } from '@/src/entities/member/member';

export const DEV_MOCK_ACCESS_TOKEN = 'dev-mock-owner-access-token';
export const DEV_MOCK_REFRESH_TOKEN = 'dev-mock-owner-refresh-token';
export const DEV_MOCK_STORE_ID = 'dev-mock-store-id';
export const DEV_MOCK_STORE = {
  id: DEV_MOCK_STORE_ID,
  storeName: '나날이 개발점',
  businessName: '나날이',
  phone: '02-1234-5678',
};
type DevMockMember = {
  id: string;
  name: string;
  role: MemberRole;
  birthDate: string;
  joinDate: string;
  leaveDate: string | null;
  memo: string;
  canManageNotice: boolean;
  canEditSchedule: boolean;
  canEditMemberInfo: boolean;
};

type DevMockMemberListItem = Pick<
  DevMockMember,
  'id' | 'joinDate' | 'leaveDate' | 'name' | 'role'
>;

const DEV_MOCK_MEMBERS: DevMockMember[] = [
  {
    id: 'owner-dummy-id',
    name: '박서연',
    role: MemberRole.OWNER,
    birthDate: '1990-01-01',
    joinDate: '2026-03-18',
    leaveDate: null,
    memo: '개발용 오너 계정',
    canManageNotice: true,
    canEditSchedule: true,
    canEditMemberInfo: true,
  },
  {
    id: 'manager-dummy-id',
    name: '김민수',
    role: MemberRole.MANAGER,
    birthDate: '1994-09-21',
    joinDate: '2026-04-02',
    leaveDate: null,
    memo: '오픈 마감 모두 가능',
    canManageNotice: true,
    canEditSchedule: true,
    canEditMemberInfo: true,
  },
  {
    id: 'staff-dummy-id',
    name: '이지현',
    role: MemberRole.MANAGER,
    birthDate: '1998-05-11',
    joinDate: '2026-05-11',
    leaveDate: null,
    memo: '주말 근무 가능',
    canManageNotice: false,
    canEditSchedule: false,
    canEditMemberInfo: false,
  },
  {
    id: 'staff-dummy-id-2',
    name: '최유진',
    role: MemberRole.STAFF,
    birthDate: '1999-11-03',
    joinDate: '2026-05-12',
    leaveDate: null,
    memo: '평일 오후 근무 가능',
    canManageNotice: false,
    canEditSchedule: false,
    canEditMemberInfo: false,
  },
  {
    id: 'staff-dummy-id-3',
    name: '한도윤',
    role: MemberRole.STAFF,
    birthDate: '2000-07-22',
    joinDate: '2026-05-15',
    leaveDate: null,
    memo: '오픈 근무 선호',
    canManageNotice: false,
    canEditSchedule: false,
    canEditMemberInfo: false,
  },
  {
    id: 'staff-dummy-id-4',
    name: '정하린',
    role: MemberRole.STAFF,
    birthDate: '2001-02-14',
    joinDate: '2026-05-18',
    leaveDate: null,
    memo: '주말 풀타임 가능',
    canManageNotice: false,
    canEditSchedule: false,
    canEditMemberInfo: false,
  },
  {
    id: 'manager-dummy-id-2',
    name: '오세훈',
    role: MemberRole.MANAGER,
    birthDate: '1992-08-30',
    joinDate: '2026-04-10',
    leaveDate: null,
    memo: '재고 관리 담당',
    canManageNotice: true,
    canEditSchedule: true,
    canEditMemberInfo: true,
  },
];

function toMemberListItem({
  id,
  joinDate,
  leaveDate,
  name,
  role,
}: DevMockMember): DevMockMemberListItem {
  return {
    id,
    joinDate,
    leaveDate,
    name,
    role,
  };
}

export function getDevMockMemberList(search?: string) {
  const keyword = search?.trim() ?? '';

  if (!keyword) {
    return DEV_MOCK_MEMBERS.map(toMemberListItem);
  }

  return DEV_MOCK_MEMBERS.filter(({ name }) => name.includes(keyword)).map(
    toMemberListItem,
  );
}

export function getDevMockMember(memberId: string) {
  return DEV_MOCK_MEMBERS.find(({ id }) => id === memberId) ?? null;
}

export function getDevMockAuthResponse() {
  return {
    accessToken: DEV_MOCK_ACCESS_TOKEN,
    refreshToken: DEV_MOCK_REFRESH_TOKEN,
    isTempPassword: false,
    isProfileComplete: true,
    name: '개발용 오너',
    birthDate: '1990-01-01',
  };
}

let serverStarted = true;

export function startMockServer() {
  if (!__DEV__ || serverStarted) {
    return;
  }

  createServer({
    routes() {
      this.namespace = '__mock__';

      this.post('/auth/login', () => {
        return getDevMockAuthResponse();
      });

      this.get('/user/profile', () => {
        return {
          name: '개발용 오너',
          birthDate: '1990-01-01',
          email: 'owner.dev@nanaly.local',
          hasPassword: true,
          isTempPassword: false,
          socialAccounts: [],
        };
      });

      this.get('/stores/me', () => {
        return [
          {
            storeId: DEV_MOCK_STORE_ID,
            storeName: DEV_MOCK_STORE.storeName,
            role: 'owner',
            permissions: {
              canManageNotice: true,
              canEditSchedule: true,
              canEditMemberInfo: true,
            },
          },
        ];
      });

      this.post('/stores', () => {
        return {
          storeId: DEV_MOCK_STORE_ID,
        };
      });

      this.get('/stores/:storeId', (_schema, request) => {
        if (request.params.storeId !== DEV_MOCK_STORE_ID) {
          return {};
        }

        return DEV_MOCK_STORE;
      });

      this.patch('/stores/:storeId', (_schema, request) => {
        if (request.params.storeId !== DEV_MOCK_STORE_ID) {
          return {};
        }

        return DEV_MOCK_STORE;
      });

      this.delete('/stores/:storeId', () => {
        return {};
      });

      this.get('/stores/:storeId/members', (_schema, request) => {
        if (request.params.storeId !== DEV_MOCK_STORE_ID) {
          return [];
        }

        const search =
          typeof request.queryParams.search === 'string'
            ? request.queryParams.search.trim()
            : '';
        if (!search) {
          return DEV_MOCK_MEMBERS.map(toMemberListItem);
        }

        return DEV_MOCK_MEMBERS.filter(({ name }) => name.includes(search)).map(
          toMemberListItem,
        );
      });

      this.get('/stores/:storeId/members/:memberId', (_schema, request) => {
        if (request.params.storeId !== DEV_MOCK_STORE_ID) {
          return {};
        }

        return getDevMockMember(request.params.memberId) ?? {};
      });

      this.patch('/stores/:storeId/members/:memberId', (_schema, request) => {
        if (request.params.storeId !== DEV_MOCK_STORE_ID) {
          return {};
        }

        return getDevMockMember(request.params.memberId) ?? {};
      });

      this.delete('/stores/:storeId/members/:memberId', () => {
        return {};
      });

      this.post('/stores/:storeId/invitations', (_schema, request) => {
        return {
          inviteLink: `https://nanaly.dev/invite/${request.params.storeId}`,
        };
      });

      this.get('/stores/:storeId/dashboard/staff', (_schema, request) => {
        return {
          header: {
            role: 'owner',
            storeName:
              request.params.storeId === DEV_MOCK_STORE_ID
                ? DEV_MOCK_STORE.storeName
                : '나날이',
            unreadNotificationCount: 0,
          },
          notices: [],
          schedules: {
            current: null,
            upcoming: [],
          },
        };
      });

      this.get('/stores/:storeId/dashboard/admin', (_schema, request) => {
        return {
          header: {
            role: 'owner',
            storeName:
              request.params.storeId === DEV_MOCK_STORE_ID
                ? DEV_MOCK_STORE.storeName
                : '나날이',
            unreadNotificationCount: 0,
          },
          summary: {
            todayWorkerCount: 0,
            totalMemberCount: DEV_MOCK_MEMBERS.length,
          },
        };
      });

      this.passthrough();
    },
  });

  serverStarted = true;
}

export function isDevMockToken(token: string | null | undefined) {
  return token === DEV_MOCK_ACCESS_TOKEN;
}

export function getDevMockPath(path: string) {
  return `/__mock__${path}`;
}
