import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import { MemberRole } from '@/src/entities/member/member';
import { Notice } from '@/src/entities/notice/notice';
import { getNotices } from '@/src/features/notice/api/notice';
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

type TypeSchedules = {
  id: string;
};

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
  //todo: 스케줄 구현 후 데이터 삭제
  const [schedule, setSchedule] = useState<TypeSchedules[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!storeId) {
        return;
      }

      const fetchDashboard = async () => {
        try {
          const [{ data: dashboard }, { data: noticeList }] = await Promise.all([
            getDashboardInfos(storeId),
            getNotices(storeId),
          ]);
          const { header, schedules } = dashboard;

          setHeaderInfo(header);
          setNotices((noticeList as Notice[]).slice(0, 3));
          setSchedule([
            ...(schedules?.current ? [schedules.current] : []),
            ...schedules.upcoming,
          ]);
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
