import { canManageNotice } from '@/src/features/permission/lib/access';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import AccessDenied from '@/src/shared/ui/AccessDenied';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';

export default function NoticePage() {
  const access = useCurrentStoreAccess();

  if (!canManageNotice(access)) {
    return (
      <AccessDenied
        title="공지 화면에 접근할 수 없어요"
        message="공지 관리 권한이 있는 사용자만 접근할 수 있어요"
      />
    );
  }

  return (
    <PageLayout title="공지">
      <NText variant="r14">NoticePage</NText>
    </PageLayout>
  );
}
