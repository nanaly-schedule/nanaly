import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import { Notice } from '@/src/entities/notice/notice';
import { UserStorePermissions } from '@/src/entities/user/user';
import { getDashboardInfos } from '@/src/features/store/api/dashboard';
import { getMyStore } from '@/src/features/store/api/store';
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

type MyStoreAccessItem = {
  storeId: string;
  role: MemberRole;
  permissions?: UserStorePermissions | null;
};

function getDashboardNotices(dashboard: {
  notices?: Notice[];
  noticeList?: Notice[];
}) {
  return dashboard.notices ?? dashboard.noticeList ?? [];
}

function isSamePermissions(
  left: UserStorePermissions | null,
  right: UserStorePermissions | null,
) {
  if (!left || !right) {
    return left === right;
  }

  return (
    left.canManageNotice === right.canManageNotice &&
    left.canEditSchedule === right.canEditSchedule &&
    left.canEditMemberInfo === right.canEditMemberInfo
  );
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
  const canAccessAdminMode =
    currentStoreRole === MemberRole.OWNER ||
    currentStoreRole === MemberRole.MANAGER;
  const params = useLocalSearchParams<{
    storeId?: string | string[];
    displayStoreName: string;
  }>();
  const storeId = normalizeStoreId(params.storeId) ?? currentStoreId ?? '';
  const { displayStoreName } = params;
  const [headerInfo, setHeaderInfo] = useState<TypeHeaderInfo | null>(null);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  const syncCurrentStoreAccess = useCallback(async () => {
    try {
      const { data } = await getMyStore();
      const currentStore = (Array.isArray(data) ? data : []).find(
        (store: MyStoreAccessItem) => store.storeId === storeId,
      );

      if (!currentStore) {
        return;
      }

      const nextPermissions = currentStore.permissions ?? null;
      const {
        currentStoreId: savedStoreId,
        currentStoreRole: savedStoreRole,
        currentStorePermissions: savedStorePermissions,
        setUser,
      } = useUser.getState();

      if (
        savedStoreId !== currentStore.storeId ||
        savedStoreRole !== currentStore.role ||
        !isSamePermissions(savedStorePermissions, nextPermissions)
      ) {
        setUser({
          currentStoreAccessLoaded: true,
          currentStoreId: currentStore.storeId,
          currentStoreRole: currentStore.role,
          currentStorePermissions: nextPermissions,
        });
      }
    } catch {
      // 권한 동기화 실패 시 기존 전역 권한을 유지하고 다음 홈 포커스에서 다시 시도합니다.
    }
  }, [storeId]);

  useFocusEffect(
    useCallback(() => {
      if (!storeId) {
        return;
      }

      const fetchDashboard = async () => {
        try {
          void syncCurrentStoreAccess();
          const { data: dashboard } = await getDashboardInfos(storeId);
          const { header, schedules } = dashboard;
          const nextSchedules = [
            ...(schedules?.current
              ? [{ ...schedules.current, status: 'current' as const }]
              : []),
            ...(schedules?.upcoming ?? []).map(
              (item: Omit<Schedule, 'status'>) => ({
                ...item,
                status: 'upcoming' as const,
              }),
            ),
          ];
          const dashboardNotices = getDashboardNotices(dashboard).slice(0, 5);

          setHeaderInfo(header);
          setNotices(dashboardNotices);
          setSchedule(nextSchedules);
        } catch {
          // todo: 403 -> not found redirect
        }
      };

      fetchDashboard();
    }, [storeId, syncCurrentStoreAccess]),
  );
  return (
    <PageLayout showHeader={false}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <StoreHeader
          storeName={displayStoreName ?? headerInfo?.storeName ?? ''}
          isOwner={
            canAccessAdminMode ||
            (!!headerInfo && headerInfo.role !== MemberRole.STAFF)
          }
          isActiveOwner={false}
          canAddStore={
            currentStoreRole
              ? currentStoreRole !== MemberRole.OWNER
              : headerInfo?.role !== MemberRole.OWNER
          }
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
              params: { storeId, displayStoreName },
            });
          }}
        />
      </ScrollView>
    </PageLayout>
  );
}
