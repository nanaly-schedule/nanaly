import { MemberRole } from '@/src/entities/member/member';

export interface UserStorePermissions {
  canManageNotice: boolean;
  canEditSchedule: boolean;
  canEditMemberInfo: boolean;
}

export interface User {
  name: string;
  nickname: string;
  email: string;
  birthDate: string;
  isTempPassword: boolean;
  currentStoreAccessLoaded: boolean;
  currentStoreId: string | null;
  currentStoreRole: MemberRole | null;
  currentStorePermissions: UserStorePermissions | null;
}
