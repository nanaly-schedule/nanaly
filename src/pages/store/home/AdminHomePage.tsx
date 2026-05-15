import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import { canAccessAdminHome } from '@/src/features/permission/lib/access';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import { getAdminboardInfos } from '@/src/features/store/api/dashboard';
import { spacingSpacing8, spacingSpacing12 } from '@/src/init/styles/tokens';
import AccessDenied from '@/src/shared/ui/AccessDenied';
import PageLayout from '@/src/shared/ui/PageLayout';
import StoreHeader from '@/src/widgets/store/home/StoreHeader';
import StoreInfoBtn from '@/src/widgets/store/home/StoreInfoBtn';
import TodayWorker from '@/src/widgets/store/home/TodayWorker';
import WorkerSection from '@/src/widgets/store/home/WorkerSection';
import InviteCodeWidget from '@/src/widgets/store/InviteCodeWidget';
//{"header": {"role": "owner", "storeName": "나날이 ", "unreadNotificationCount": 0}, "summary": {"todayWorkerCount": 0, "totalMemberCount": 2}}
type TypeHeaderInfo = {
  role: MemberRole;
  storeName: string;
  unreadNotificationCount: number;
};

type TypeSummaryInfo = {
  todayWorkerCount: number;
  totalMemberCount: number;
};

/**
 *
 * 접근 권한: 오너, 매니저
 *
 * 편집 권한: 오너, 매니저
 */
export default function AdminHomePage() {
  const { storeId, displayStoreName } = useLocalSearchParams<{
    storeId: string;
    displayStoreName: string;
  }>();
  const access = useCurrentStoreAccess();

  const [headerInfo, setHeaderInfo] = useState<TypeHeaderInfo | null>(null);
  const [summaryInfo, setSummaryInfo] = useState<TypeSummaryInfo | null>(null);

  useEffect(() => {
    if (!canAccessAdminHome(access)) {
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await getAdminboardInfos(storeId);

        const { header, summary } = data;
        setHeaderInfo(header);
        setSummaryInfo(summary);
      } catch {}
    };
    fetch();
  }, [access, storeId]);

  if (!canAccessAdminHome(access)) {
    return (
      <AccessDenied
        title="관리자 화면에 접근할 수 없어요"
        message="매니저 이상 권한이 있어야 관리자 홈을 사용할 수 있어요"
      />
    );
  }

  return (
    <PageLayout showHeader={false}>
      <StoreHeader
        storeName={displayStoreName ?? headerInfo?.storeName ?? ''}
        isOwner={headerInfo?.role !== MemberRole.STAFF}
        isActiveOwner
      />
      <View style={{ flexDirection: 'row', gap: spacingSpacing12 }}>
        <TodayWorker todayWorker={summaryInfo?.todayWorkerCount ?? 0} />
        <View style={{ gap: spacingSpacing8, flex: 1 }}>
          <StoreInfoBtn />
          <InviteCodeWidget />
        </View>
      </View>
      <WorkerSection totalWorker={summaryInfo?.totalMemberCount ?? 0} />
    </PageLayout>
  );
}
