export enum MemberRole {
  STAFF = 'staff',
  MANAGER = 'manager',
  OWNER = 'owner',
}

export enum MemberRoleLabel {
  STAFF = '알바',
  MANAGER = '매니저',
  OWNER = '오너',
}

export type EditableMemberRole = Exclude<MemberRole, MemberRole.OWNER>;

export const MEMBER_ROLE_LABEL: Record<MemberRole, MemberRoleLabel> = {
  [MemberRole.STAFF]: MemberRoleLabel.STAFF,
  [MemberRole.MANAGER]: MemberRoleLabel.MANAGER,
  [MemberRole.OWNER]: MemberRoleLabel.OWNER,
};

export function getMemberRoleLabel(role: MemberRole) {
  return MEMBER_ROLE_LABEL[role];
}

export interface Member {
  memberId: string;
  userId: string;
  storeId: string;
  role: MemberRole;
  joinDate: string;
  leaveDate: string | null;
  memo: string;
  canManageNotice: boolean;
  canEditSchedule: boolean;
  canEditMemberInfo: boolean;
}
