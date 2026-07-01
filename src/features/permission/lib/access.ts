import { MemberRole } from '@/src/entities/member/member';
import { UserStorePermissions } from '@/src/entities/user/user';

export type CurrentStoreAccess = {
  loaded: boolean;
  role: MemberRole | null;
  permissions: UserStorePermissions | null;
  isOwner: boolean;
  canAccessAdminHome: boolean;
  canAccessStoreInfo: boolean;
  canEditStoreInfo: boolean;
  canAccessMemberInfo: boolean;
  canEditMemberInfo: boolean;
  canEditSchedule: boolean;
  canManageNotice: boolean;
};

export function getCurrentStoreAccess(input: {
  loaded: boolean;
  role: MemberRole | null;
  permissions: UserStorePermissions | null;
}): CurrentStoreAccess {
  const { loaded, role, permissions } = input;
  const isOwner = role === MemberRole.OWNER;
  const isManager = role === MemberRole.MANAGER;
  return {
    loaded,
    role,
    permissions,
    isOwner,
    canAccessAdminHome: isOwner || isManager,
    canAccessStoreInfo: isOwner || isManager,
    canEditStoreInfo: isOwner,
    canAccessMemberInfo: isOwner || isManager,
    canEditMemberInfo: isOwner || !!permissions?.canEditMemberInfo,
    canEditSchedule:
      isOwner || (isManager && !!permissions?.canEditSchedule),
    canManageNotice: isOwner || !!permissions?.canManageNotice,
  };
}

export function canAccessAdminHome(access: CurrentStoreAccess) {
  return access.canAccessAdminHome;
}

export function canAccessStoreInfo(access: CurrentStoreAccess) {
  return access.canAccessStoreInfo;
}

export function canEditStoreInfo(access: CurrentStoreAccess) {
  return access.canEditStoreInfo;
}

export function canAccessMemberInfo(access: CurrentStoreAccess) {
  return access.canAccessMemberInfo;
}

export function canEditMemberInfo(access: CurrentStoreAccess) {
  return access.canEditMemberInfo;
}

export function canEditSchedule(access: CurrentStoreAccess) {
  return access.canEditSchedule;
}

export function canManageNotice(access: CurrentStoreAccess) {
  return access.canManageNotice;
}
