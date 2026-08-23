import { MemberRole } from '@/src/entities/member/member';

export interface UpdateMemberRequest {
  nickname: string | null;
  role: MemberRole; //'owner';
  joinDate: string; //'2026-01-15';
  leaveDate: string; //'2026-12-31';
  memo: string; //'주방 업무 능숙';
  canManageNotice: boolean; // true;
  canEditSchedule: boolean; // true;
  canEditMemberInfo: boolean; //true;
}
