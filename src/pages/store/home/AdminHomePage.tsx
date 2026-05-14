import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { getAdminboardInfos } from '@/src/features/store/api/dashboard';
import { spacingSpacing8, spacingSpacing12 } from '@/src/init/styles/tokens';
import PageLayout from '@/src/shared/ui/PageLayout';
import StoreHeader from '@/src/widgets/store/home/StoreHeader';
import StoreInfoBtn from '@/src/widgets/store/home/StoreInfoBtn';
import TodayWorker from '@/src/widgets/store/home/TodayWorker';
import WorkerSection from '@/src/widgets/store/home/WorkerSection';
import InviteCodeWidget from '@/src/widgets/store/InviteCodeWidget';
//{"header": {"role": "owner", "storeName": "나날이 ", "unreadNotificationCount": 0}, "summary": {"todayWorkerCount": 0, "totalMemberCount": 2}}
type TypeHeaderInfo = {
  role: 'owner' | 'manager';
  storeName: string;
  unreadNotificationCount: number;
};

type TypeSummaryInfo = {
  todayWorkerCount: number;
  totalMemberCount: number;
};

export default function AdminHomePage() {
  const route = useRouter();
  const { storeId, displayStoreName } = useLocalSearchParams<{
    storeId: string;
    displayStoreName: string;
  }>();

  const [headerInfo, setHeaderInfo] = useState<TypeHeaderInfo | null>(null);
  const [summaryInfo, setSummaryInfo] = useState<TypeSummaryInfo | null>(null);
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getAdminboardInfos(storeId);

        const { header, summary } = data;
        setHeaderInfo(header);
        setSummaryInfo(summary);
      } catch {}
    };
    fetch();
  }, []);
  return (
    <PageLayout showHeader={false}>
      <StoreHeader storeName={displayStoreName ?? ''} isOwner isActiveOwner />
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
