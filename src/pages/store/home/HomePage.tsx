import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

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

type TypeSchedules = {
  id: string;
};

export default function HomePage() {
  const currentStoreRole = useUser((state) => state.currentStoreRole);
  const isOwner = currentStoreRole !== MemberRole.STAFF;
  const { storeId, displayStoreName } = useLocalSearchParams<{
    storeId: string;
    displayStoreName: string;
  }>();
  const [headerInfo, setHeaderInfo] = useState<TypeHeaderInfo | null>(null);
  //todo: 스케줄 구현 후 데이터 삭제
  const [schedule, setSchedule] = useState<TypeSchedules[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        //{"header": {"role": "staff", "storeName": "나날이 ", "unreadNotificationCount": 0}, "notices": [], "schedules": {"current": null, "upcoming": []}}
        const { data } = await getDashboardInfos(storeId);

        const { header, schedules, notices: dashboardNotices } = data;
        setHeaderInfo(header);
        setNotices(
          dashboardNotices.map((notice: Notice) => ({
            ...notice,
            id: notice.id ?? notice.noticeId,
          })),
        );

        setSchedule([
          ...(schedules?.current ? [schedules.current] : []),
          ...schedules.upcoming,
        ]);
      } catch (error) {
        console.log(error);
        //todo: 403 -> not found redirect
      }
    };
    fetch();
  }, [storeId]);
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
          router.push({
            pathname: '/(notice)/[storeId]/notice-detail',
            params: { storeId, noticeId },
          });
        }}
        onPressHeader={() => {
          router.push({ 
            pathname: `/(notice)/[storeId]/notice`,
            params: { storeId, displayStoreName }
           })
        }} />
    </PageLayout>
  );
}
