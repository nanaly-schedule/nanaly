import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { getDashboardInfos } from '@/src/features/store/api/dashboard';
import PageLayout from '@/src/shared/ui/PageLayout';
import CurrentWeekSchedules from '@/src/widgets/store/home/CurrentWeekSchedules';
import StoreHeader from '@/src/widgets/store/home/StoreHeader';

type TypeHeaderInfo = {
  role: 'staff' | 'manager';
  storeName: string;
  unreadNotificationCount: number;
};

type TypeSchedules = {
  id: string;
};

export default function HomePage() {
  const route = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  const [headerInfo, setHeaderInfo] = useState<TypeHeaderInfo | null>(null);
  //todo: 스케줄 구현 후 데이터 삭제
  const [schedule, setSchedule] = useState<TypeSchedules[]>([
    { id: '1' },
    { id: '12' },
    { id: '122' },
  ]);

  useEffect(() => {
    const fetch = async () => {
      try {
        //{"header": {"role": "staff", "storeName": "나날이 ", "unreadNotificationCount": 0}, "notices": [], "schedules": {"current": null, "upcoming": []}}
        const { data } = await getDashboardInfos(storeId);

        const { header, notices, schedules } = data;
        setHeaderInfo(header);
        setSchedule([schedules?.current, ...schedules.upcoming]);
      } catch {}
    };
    fetch();
  }, [storeId]);

  return (
    <PageLayout showHeader={false}>
      <StoreHeader
        storeName={headerInfo?.storeName ?? ''}
        isOwner={headerInfo?.role !== 'staff'}
        isActiveOwner={false}
      />
      <CurrentWeekSchedules schedules={schedule} />
    </PageLayout>
  );
}
