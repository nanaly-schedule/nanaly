import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import {
  getAdminboardInfos,
  getDashboardInfos,
} from '@/src/features/store/api/dashboard';
import { getMembers } from '@/src/features/store/api/member';
import { spacingSpacing8, spacingSpacing12 } from '@/src/init/styles/tokens';
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
  const { storeId: routeStoreId, displayStoreName } = useLocalSearchParams<{
    storeId?: string | string[];
    displayStoreName?: string;
  }>();
  const storeId = Array.isArray(routeStoreId) ? routeStoreId[0] : routeStoreId;

  const [headerInfo, setHeaderInfo] = useState<TypeHeaderInfo | null>(null);
  const [summaryInfo, setSummaryInfo] = useState<TypeSummaryInfo | null>(null);

  useEffect(() => {
    if (!storeId) {
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await getAdminboardInfos(storeId);
        const { header, summary } = data;
        setHeaderInfo(header);
        setSummaryInfo(summary);
      } catch {
        try {
          const [{ data: dashboard }, { data: members }] = await Promise.all([
            getDashboardInfos(storeId),
            getMembers(storeId),
          ]);

          setHeaderInfo(dashboard.header);
          setSummaryInfo({
            todayWorkerCount: 0,
            totalMemberCount: Array.isArray(members) ? members.length : 0,
          });
        } catch {
          setHeaderInfo(null);
          setSummaryInfo(null);
        }
      }
    };
    fetch();
  }, [storeId]);

  return (
    <PageLayout showHeader={false}>
      <StoreHeader
        storeName={displayStoreName ?? headerInfo?.storeName ?? ''}
        isOwner={headerInfo?.role !== MemberRole.STAFF}
        isActiveOwner
        canAddStore={headerInfo?.role !== MemberRole.OWNER}
        unreadNotificationCount={headerInfo?.unreadNotificationCount ?? 0}
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
