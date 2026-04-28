export type MemberRole = 'OWNER' | 'MANAGER' | 'CREW';

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
