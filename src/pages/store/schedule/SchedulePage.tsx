import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import {
  backgroundColorWhite,
  buttonColorCta,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import {
  MOCK_POSITIONS,
  MOCK_SCHEDULES,
  MOCK_UNAVAILABLE_SCHEDULES,
  ScheduleItem,
  ScheduleViewType,
} from '@/src/widgets/schedule/mock';
import ScheduleCalendar from '@/src/widgets/schedule/ScheduleCalendar';
import ScheduleDateBottomSheet from '@/src/widgets/schedule/ScheduleDateBottomSheet';
import ScheduleFilterBar, {
  ScheduleWorkType,
} from '@/src/widgets/schedule/ScheduleFilterBar';
import ScheduleFormBottomSheet from '@/src/widgets/schedule/ScheduleFormBottomSheet';
import ScheduleMonthPickerBottomSheet from '@/src/widgets/schedule/ScheduleMonthPickerBottomSheet';

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getMonthStart(dateString: string) {
  return `${dateString.slice(0, 7)}-01`;
}

function formatMonthTitle(month: string) {
  const [year, monthNumber] = month.split('-');
  return `${year}년 ${Number(monthNumber)}월`;
}

function groupSchedulesByDate(schedules: ScheduleItem[]) {
  return schedules.reduce<Record<string, ScheduleItem[]>>((acc, schedule) => {
    acc[schedule.date] = [...(acc[schedule.date] ?? []), schedule];
    return acc;
  }, {});
}

function isMySchedule(schedule: ScheduleItem) {
  return !!schedule.isMine || schedule.memberId === 'me';
}

function isUnavailableSchedule(schedule: ScheduleItem) {
  return schedule.positionId === 'unavailable';
}

function hasPosition(schedule: ScheduleItem) {
  return !!schedule.positionId;
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(':').map(Number);

  return hour * 60 + minute;
}

function isTimeOverlapping(first: ScheduleItem, second: ScheduleItem) {
  return (
    timeToMinutes(first.startTime) < timeToMinutes(second.endTime) &&
    timeToMinutes(second.startTime) < timeToMinutes(first.endTime)
  );
}

export default function SchedulePage() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const access = useCurrentStoreAccess();
  const isManager = access.role === MemberRole.MANAGER;
  const canViewAllUnavailable = access.isOwner || isManager;
  const { canEditSchedule } = access;

  const today = getTodayString();
  const [currentMonth, setCurrentMonth] = useState(getMonthStart(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewType, setViewType] = useState<ScheduleViewType>('mine');
  const [workType, setWorkType] = useState<ScheduleWorkType>('assigned');
  const [positionId, setPositionId] = useState('all');
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [dateDetailVisible, setDateDetailVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleItem | null>(null);
  const [assignedSchedules, setAssignedSchedules] =
    useState<ScheduleItem[]>(MOCK_SCHEDULES);
  const [unavailableSchedules, setUnavailableSchedules] = useState(
    MOCK_UNAVAILABLE_SCHEDULES,
  );
  const canSelectAllView =
    workType === 'assigned' || canViewAllUnavailable;

  useEffect(() => {
    if (!access.loaded) {
      return;
    }

    setViewType(canViewAllUnavailable ? 'all' : 'mine');
  }, [access.loaded, canViewAllUnavailable]);

  useEffect(() => {
    if (workType === 'unavailable' && !canViewAllUnavailable) {
      setViewType('mine');
    }
  }, [canViewAllUnavailable, workType]);

  const filteredSchedules = useMemo(() => {
    const sourceSchedules =
      workType === 'unavailable'
        ? unavailableSchedules
        : assignedSchedules;

    return sourceSchedules.filter((schedule) => {
      if (viewType === 'mine' && !isMySchedule(schedule)) {
        return false;
      }

      if (
        workType === 'assigned' &&
        positionId !== 'all' &&
        (!hasPosition(schedule) || schedule.positionId !== positionId)
      ) {
        return false;
      }

      return schedule.date.startsWith(currentMonth.slice(0, 7));
    });
  }, [
    assignedSchedules,
    currentMonth,
    positionId,
    unavailableSchedules,
    viewType,
    workType,
  ]);

  const schedulesByDate = useMemo(
    () => groupSchedulesByDate(filteredSchedules),
    [filteredSchedules],
  );

  const canEditScheduleItem = (schedule: ScheduleItem) => {
    if (isUnavailableSchedule(schedule)) {
      return isMySchedule(schedule);
    }

    return canEditSchedule;
  };

  const canDeleteUnavailable = (schedule: ScheduleItem) =>
    isUnavailableSchedule(schedule) && isMySchedule(schedule);

  const hasUnavailableConflict = (schedule: ScheduleItem) => {
    if (!isUnavailableSchedule(schedule)) {
      return false;
    }

    return assignedSchedules.some(
      (assignedSchedule) =>
        assignedSchedule.date === schedule.date &&
        assignedSchedule.memberId === schedule.memberId &&
        isTimeOverlapping(assignedSchedule, schedule),
    );
  };

  const canCreateCurrentWorkType =
    workType === 'unavailable' || canEditSchedule;

  const handlePressSchedule = (scheduleId: string) => {
    const schedule = filteredSchedules.find((item) => item.id === scheduleId);

    if (!schedule || !canEditScheduleItem(schedule)) {
      return;
    }

    setSelectedDate(schedule.date);
    setSelectedSchedule(schedule);
    setFormVisible(true);
  };

  const handlePressDate = (date: string) => {
    setSelectedDate(date);
    setDateDetailVisible(true);
  };

  const selectedDateSchedules = schedulesByDate[selectedDate] ?? [];

  if (!access.loaded) {
    return (
      <PageLayout
        title="스케줄"
        showBackButton={false}
        style={styles.page}
      >
        <View style={styles.loading}>
          <NText variant="r14" style={styles.loadingText}>
            권한 정보를 불러오는 중이에요
          </NText>
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="스케줄"
      showBackButton={false}
      style={styles.page}
    >
      <View style={styles.header}>
        <Pressable onPress={() => setMonthPickerVisible(true)}>
          <NText variant="b16" style={styles.monthTitle}>
            {formatMonthTitle(currentMonth)}⌄
          </NText>
        </Pressable>
      </View>

      <ScheduleFilterBar
        viewType={viewType}
        workType={workType}
        positionId={positionId}
        positions={MOCK_POSITIONS}
        onChangeViewType={setViewType}
        onChangeWorkType={setWorkType}
        onChangePosition={setPositionId}
        canManagePosition={canEditSchedule}
        canSelectAllView={canSelectAllView}
        showPositionFilter={workType === 'assigned'}
        onPressPositionManage={() =>
          router.push(`/${storeId}/schedule/positions`)
        }
      />

      <ScheduleCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        schedulesByDate={schedulesByDate}
        compactLabel={viewType === 'mine' ? 'time' : 'member'}
        onPressDate={handlePressDate}
        onPressSchedule={handlePressSchedule}
      />

      {canCreateCurrentWorkType && (
        <Pressable
          style={styles.floatingButton}
          onPress={() => {
            setSelectedSchedule(null);
            setFormVisible(true);
          }}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      )}

      <ScheduleMonthPickerBottomSheet
        visible={monthPickerVisible}
        currentMonth={currentMonth}
        onClose={() => setMonthPickerVisible(false)}
        onChangeMonth={(month) => {
          setCurrentMonth(month);
          setSelectedDate(month);
        }}
      />

      <ScheduleFormBottomSheet
        visible={formVisible}
        date={selectedDate}
        schedule={selectedSchedule}
        onClose={() => {
          setFormVisible(false);
          setSelectedSchedule(null);
        }}
      />

      <ScheduleDateBottomSheet
        visible={dateDetailVisible}
        date={selectedDate}
        workType={workType}
        schedules={selectedDateSchedules}
        canEditSchedule={canEditScheduleItem}
        canDeleteUnavailable={canDeleteUnavailable}
        hasConflict={hasUnavailableConflict}
        onClose={() => {
          setDateDetailVisible(false);
        }}
        onPressSchedule={(schedule) => {
          if (!canEditScheduleItem(schedule)) {
            return;
          }

          setSelectedSchedule(schedule);
          setDateDetailVisible(false);
          setFormVisible(true);
        }}
        onPressDeleteUnavailable={(scheduleId) => {
          setUnavailableSchedules((prev) =>
            prev.filter(
              (schedule) =>
                schedule.id !== scheduleId || !isMySchedule(schedule),
            ),
          );
        }}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: backgroundColorWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginBottom: 20,
  },
  monthTitle: {
    color: typoColorPrimary,
  },
  floatingButton: {
    position: 'absolute',
    right: 8,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: buttonColorCta,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: typoColorPrimary,
  },
});
