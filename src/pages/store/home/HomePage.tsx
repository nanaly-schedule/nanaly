import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import { MemberRole } from '@/src/entities/member/member';
import { Notice } from '@/src/entities/notice/notice';
import { getDashboardInfos } from '@/src/features/store/api/dashboard';
import useUser from '@/src/features/user/lib/useUser';
import PageLayout from '@/src/shared/ui/PageLayout';
import NoticeWidget from '@/src/widgets/notice/NoticeWidget';
import CurrentWeekSchedules from '@/src/widgets/store/home/CurrentWeekSchedules';
import StoreHeader from '@/src/widgets/store/home/StoreHeader';

type TypeHeaderInfo = {
  role: MemberRole;
  storeName: string;
  unreadNotificationCount: number;
};

type Schedule = {
  scheduleId: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  status: 'current' | 'upcoming';
};

function getDashboardNotices(dashboard: { notices?: Notice[]; noticeList?: Notice[] }) {
  return dashboard.notices ?? dashboard.noticeList ?? [];
}

function normalizeStoreId(value?: string | string[]) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  if (!nextValue || nextValue === 'undefined' || nextValue === 'null') {
    return undefined;
  }

  return nextValue;
}

export default function HomePage() {
  const currentStoreRole = useUser((state) => state.currentStoreRole);
  const currentStoreId = useUser((state) => state.currentStoreId);
  const isOwner = currentStoreRole !== MemberRole.STAFF;
  const params = useLocalSearchParams<{
    storeId?: string | string[];
    displayStoreName: string;
  }>();
  const storeId = normalizeStoreId(params.storeId) ?? currentStoreId ?? '';
  const { displayStoreName } = params;
  const [headerInfo, setHeaderInfo] = useState<TypeHeaderInfo | null>(null);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!storeId) {
        return;
      }

      const fetchDashboard = async () => {
        try {
          const { data: dashboard } = await getDashboardInfos(storeId);
          const { header, schedules } = dashboard;
          const nextSchedules = [
            ...(schedules?.current
              ? [{ ...schedules.current, status: 'current' as const }]
              : []),
            ...(schedules?.upcoming ?? []).map((item: Omit<Schedule, 'status'>) => ({
              ...item,
              status: 'upcoming' as const,
            })),
          ];

          setHeaderInfo(header);
          setNotices(getDashboardNotices(dashboard).slice(0, 3));
          setSchedule(nextSchedules);
        } catch {
          // todo: 403 -> not found redirect
        }
      };

      fetchDashboard();
    }, [storeId]),
  );
  return (
    <PageLayout showHeader={false}>
      <StoreHeader
        storeName={displayStoreName ?? headerInfo?.storeName ?? ''}
        isOwner={
          isOwner || (!!headerInfo && headerInfo.role !== MemberRole.STAFF)
        }
        isActiveOwner={false}
        unreadNotificationCount={headerInfo?.unreadNotificationCount ?? 0}
      />
      <CurrentWeekSchedules schedules={schedule} />
        <NoticeWidget 
        notices={notices}
        onPressNotice={(noticeId) => {
          if (!storeId) {
            return;
          }

          router.push({
            pathname: '/(notice)/[storeId]/notice-detail',
            params: { storeId, noticeId },
          });
        }}
        onPressHeader={() => {
          if (!storeId) {
            return;
          }

          router.push({ 
            pathname: `/(notice)/[storeId]/notice`,
            params: { storeId, displayStoreName }
           })
        }} />
    </PageLayout>
  );
}
