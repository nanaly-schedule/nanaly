import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import { getPositions } from '@/src/features/schedule/api/position';
import {
  getDailySchedules,
  getMonthlySchedules,
  ScheduleScope,
} from '@/src/features/schedule/api/schedule';
import useUser from '@/src/features/user/lib/useUser';
import { buttonColorCta, typoColorPrimary } from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import {
  MOCK_UNAVAILABLE_SCHEDULES,
  ScheduleItem,
  SchedulePosition,
  ScheduleViewType,
} from '@/src/widgets/schedule/mock';
import { mapPositionResponses } from '@/src/widgets/schedule/positionMapper';
import ScheduleCalendar from '@/src/widgets/schedule/ScheduleCalendar';
import ScheduleDateBottomSheet from '@/src/widgets/schedule/ScheduleDateBottomSheet';
import ScheduleFilterBar, {
  ScheduleWorkType,
} from '@/src/widgets/schedule/ScheduleFilterBar';
import ScheduleFormBottomSheet from '@/src/widgets/schedule/ScheduleFormBottomSheet';
import ScheduleMonthPickerBottomSheet from '@/src/widgets/schedule/ScheduleMonthPickerBottomSheet';
import ScheduleUnavailableFormBottomSheet from '@/src/widgets/schedule/ScheduleUnavailableFormBottomSheet';

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

function parseMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number);

  return { year, month: monthNumber };
}

function normalizeTime(value?: string | null) {
  if (!value) {
    return '00:00';
  }

  return value.slice(0, 5);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringField(
  source: Record<string, unknown>,
  fields: string[],
): string | null {
  for (const field of fields) {
    const value = source[field];

    if (typeof value === 'string') {
      return value;
    }
  }

  return null;
}

type ScheduleEntry = {
  item: unknown;
  date?: string | null;
};

function extractScheduleEntries(data: unknown): ScheduleEntry[] {
  if (Array.isArray(data)) {
    return data.flatMap((item) => extractScheduleEntriesFromItem(item));
  }

  if (!isRecord(data)) {
    return [];
  }

  const candidates = [
    'schedules',
    'monthlySchedules',
    'items',
    'content',
    'data',
    'result',
    'days',
    'calendar',
  ];

  for (const key of candidates) {
    const value = data[key];

    if (Array.isArray(value)) {
      return value.flatMap((item) => extractScheduleEntriesFromItem(item));
    }

    if (isRecord(value)) {
      return extractScheduleEntries(value);
    }
  }

  return Object.entries(data).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((item) => ({ item, date: key }));
    }

    if (isRecord(value) && /^\d{4}-\d{2}-\d{2}$/.test(key)) {
      return extractScheduleEntries(value).map((entry) => ({
        ...entry,
        date: entry.date ?? key,
      }));
    }

    return [];
  });
}

function extractScheduleEntriesFromItem(item: unknown): ScheduleEntry[] {
  if (!isRecord(item)) {
    return [{ item }];
  }

  const date = getStringField(item, ['date', 'workDate', 'scheduleDate']);
  const nestedCandidates = [
    'schedules',
    'items',
    'works',
    'workSchedules',
    'shifts',
  ];

  for (const key of nestedCandidates) {
    const value = item[key];

    if (Array.isArray(value)) {
      return value.map((nestedItem) => ({ item: nestedItem, date }));
    }
  }

  return [{ item, date }];
}

function getNestedRecord(
  source: Record<string, unknown>,
  fields: string[],
): Record<string, unknown> {
  for (const field of fields) {
    const value = source[field];

    if (isRecord(value)) {
      return value;
    }
  }

  return {};
}

function getBooleanField(source: Record<string, unknown>, fields: string[]) {
  for (const field of fields) {
    const value = source[field];

    if (typeof value === 'boolean') {
      return value;
    }
  }

  return false;
}

function getMappedFieldReport(item: unknown, inheritedDate?: string | null) {
  if (!isRecord(item)) {
    return { reason: 'item is not an object', item };
  }

  const member = getNestedRecord(item, ['member', 'worker', 'staff']);

  return {
    date:
      inheritedDate ??
      getStringField(item, ['date', 'workDate', 'scheduleDate']),
    memberId:
      getStringField(item, ['memberId', 'storeMemberId', 'workerId', 'staffId']) ??
      getStringField(member, ['memberId', 'id', 'storeMemberId', 'staffId']),
    memberName:
      getStringField(item, ['memberName', 'workerName', 'staffName']) ??
      getStringField(member, ['name', 'memberName']),
    startTime: getStringField(item, ['startTime', 'start', 'workStartTime']),
    endTime: getStringField(item, ['endTime', 'end', 'workEndTime']),
    item,
  };
}

function logUnmappedSchedules(entries: ScheduleEntry[]) {
  const reports = entries
    .map((entry) => getMappedFieldReport(entry.item, entry.date))
    .filter(
      (report) =>
        !report.date ||
        !report.memberName,
    );

  if (reports.length > 0) {
    console.log('[schedule-monthly] unmapped', reports);
  }
}

function normalizeDate(value?: string | null) {
  if (!value) {
    return null;
  }

  return value.slice(0, 10);
}

function getScheduleDate(item: Record<string, unknown>, inheritedDate?: string | null) {
  return normalizeDate(
    inheritedDate ?? getStringField(item, ['date', 'workDate', 'scheduleDate']),
  );
}

function getScheduleTime(item: Record<string, unknown>, fields: string[]) {
  return getStringField(item, fields);
}

function getScheduleMember(item: Record<string, unknown>) {
  const member = getNestedRecord(item, ['member', 'worker', 'staff']);

  return {
    memberId:
      getStringField(item, ['memberId', 'storeMemberId', 'workerId', 'staffId']) ??
      getStringField(member, ['memberId', 'id', 'storeMemberId', 'staffId']),
    memberName:
      getStringField(item, ['memberName', 'workerName', 'staffName']) ??
      getStringField(member, ['name', 'memberName']),
  };
}

function getSchedulePosition(item: Record<string, unknown>) {
  const position = getNestedRecord(item, ['position']);

  return {
    positionId:
      getStringField(item, ['positionId']) ??
      getStringField(position, ['positionId', 'id']),
    positionName:
      getStringField(item, ['positionName']) ??
      getStringField(position, ['name', 'positionName']),
    positionColor:
      getStringField(item, ['positionColor']) ??
      getStringField(position, ['color', 'positionColor']),
  };
}

function getScheduleId(
  item: Record<string, unknown>,
  fallback: {
    date: string;
    memberId: string;
    startTime: string;
    endTime: string;
  },
) {
  return (
    getStringField(item, ['scheduleId', 'id']) ??
    `${fallback.date}-${fallback.memberId}-${fallback.startTime}-${fallback.endTime}`
  );
}

function getScheduleMemo(item: Record<string, unknown>) {
  return getStringField(item, ['memo', 'note']);
}

function mapMonthlyScheduleEntry(
  entry: ScheduleEntry,
  markAsMine: boolean,
): ScheduleItem | null {
  if (!isRecord(entry.item)) {
    return null;
  }

  const date = getScheduleDate(entry.item, entry.date);
  const { memberId, memberName } = getScheduleMember(entry.item);
  const startTime = getScheduleTime(entry.item, [
    'startTime',
    'start',
    'workStartTime',
  ]);
  const endTime = getScheduleTime(entry.item, ['endTime', 'end', 'workEndTime']);

  if (!date || !memberName) {
    return null;
  }

  const { positionId, positionName, positionColor } =
    getSchedulePosition(entry.item);
  const safeMemberId = memberId ?? `${date}-${memberName}`;
  const safeStartTime = startTime ?? '00:00';
  const safeEndTime = endTime ?? '00:00';
  const id = getScheduleId(entry.item, {
    date,
    memberId: safeMemberId,
    startTime: safeStartTime,
    endTime: safeEndTime,
  });

  return {
    id,
    date,
    memberId: safeMemberId,
    memberName,
    positionId,
    positionName,
    positionColor,
    startTime: normalizeTime(safeStartTime),
    endTime: normalizeTime(safeEndTime),
    memo: getScheduleMemo(entry.item) ?? undefined,
    isMine: markAsMine || getBooleanField(entry.item, ['isMine', 'mine']),
  };
}

function mapScheduleEntries(params: {
  data: unknown;
  fallbackDate?: string;
  markAsMine: boolean;
  positions: SchedulePosition[];
}) {
  const { data, fallbackDate, markAsMine, positions } = params;
  const entries = extractScheduleEntries(data).map((entry) => ({
    ...entry,
    date: entry.date ?? fallbackDate,
  }));
  const schedules = entries
    .map((entry) => mapMonthlyScheduleEntry(entry, markAsMine))
    .filter((schedule): schedule is ScheduleItem => !!schedule)
    .map((schedule) => attachPositionIdFromCatalog(schedule, positions));

  return { entries, schedules };
}

function getUniqueScheduleDates(schedules: ScheduleItem[]) {
  return Array.from(new Set(schedules.map((schedule) => schedule.date)));
}

function groupSchedulesByDate(schedules: ScheduleItem[]) {
  return schedules.reduce<Record<string, ScheduleItem[]>>((acc, schedule) => {
    acc[schedule.date] = [...(acc[schedule.date] ?? []), schedule];
    return acc;
  }, {});
}

function isMySchedule(schedule: ScheduleItem, userName?: string) {
  return (
    !!schedule.isMine ||
    schedule.memberId === 'me' ||
    (!!userName && schedule.memberName === userName)
  );
}

function isUnavailableSchedule(schedule: ScheduleItem) {
  return schedule.positionId === 'unavailable';
}

function attachPositionIdFromCatalog(
  schedule: ScheduleItem,
  positions: SchedulePosition[],
) {
  if (schedule.positionId) {
    return schedule;
  }

  const matchedPosition =
    positions.find(
      (position) =>
        position.name === schedule.positionName &&
        (!schedule.positionColor || position.color === schedule.positionColor),
    ) ??
    positions.find((position) => position.name === schedule.positionName);

  if (!matchedPosition) {
    return schedule;
  }

  return {
    ...schedule,
    positionId: matchedPosition.id,
  };
}

function matchesPositionFilter(
  schedule: ScheduleItem,
  selectedPosition?: SchedulePosition,
) {
  if (!selectedPosition) {
    return true;
  }

  if (schedule.positionId === selectedPosition.id) {
    return true;
  }

  return (
    schedule.positionName === selectedPosition.name &&
    (!schedule.positionColor || schedule.positionColor === selectedPosition.color)
  );
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

function normalizeStoreId(value?: string | string[]) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  if (!nextValue || nextValue === 'undefined' || nextValue === 'null') {
    return undefined;
  }

  return nextValue;
}

export default function SchedulePage() {
  const params = useLocalSearchParams<{
    storeId?: string | string[];
    openScheduleId?: string | string[];
    openScheduleModal?: string | string[];
  }>();
  const routeStoreId = normalizeStoreId(params.storeId);
  const notificationScheduleId = normalizeStoreId(params.openScheduleId);
  const shouldOpenNotificationScheduleModal =
    normalizeStoreId(params.openScheduleModal) === 'true';
  const currentStoreId = useUser((state) => state.currentStoreId);
  const userName = useUser((state) => state.name);
  const storeId = routeStoreId ?? currentStoreId ?? '';
  const isFocused = useIsFocused();
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
  const [unavailableFormVisible, setUnavailableFormVisible] = useState(false);
  const [dateDetailVisible, setDateDetailVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleItem | null>(null);
  const [assignedSchedules, setAssignedSchedules] = useState<ScheduleItem[]>(
    [],
  );
  const [dailyAssignedSchedules, setDailyAssignedSchedules] = useState<
    ScheduleItem[]
  >([]);
  const [dailyAssignedDate, setDailyAssignedDate] = useState<string | null>(
    null,
  );
  const [unavailableSchedules, setUnavailableSchedules] = useState(
    MOCK_UNAVAILABLE_SCHEDULES,
  );
  const [positions, setPositions] = useState<SchedulePosition[]>([]);
  const [scheduleRefreshKey, setScheduleRefreshKey] = useState(0);
  const [assignedSchedulesLoaded, setAssignedSchedulesLoaded] = useState(false);
  const handledNotificationScheduleIdRef = useRef<string | null>(null);
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

  useEffect(() => {
    if (workType !== 'assigned' || viewType !== 'all') {
      setPositionId('all');
    }
  }, [viewType, workType]);

  useEffect(() => {
    if (!storeId || !isFocused) {
      return;
    }

    const fetchPositions = async () => {
      try {
        const { data } = await getPositions(storeId);
        const nextPositions = mapPositionResponses(data);

        setPositions(nextPositions);
        setPositionId((currentPositionId) =>
          currentPositionId !== 'all' &&
          !nextPositions.some((position) => position.id === currentPositionId)
            ? 'all'
            : currentPositionId,
        );
      } catch {
        setPositions([]);
        setPositionId('all');
      }
    };

    fetchPositions();
  }, [isFocused, storeId]);

  useEffect(() => {
    if (!storeId || !isFocused || !access.loaded || workType !== 'assigned') {
      return;
    }

    const fetchMonthlySchedules = async () => {
      setAssignedSchedulesLoaded(false);

      try {
        const { year, month } = parseMonth(currentMonth);
        const scope: ScheduleScope = viewType;
        const { data } = await getMonthlySchedules({
          storeId,
          year,
          month,
          scope,
          positionId:
            positionId !== 'all' && workType === 'assigned'
              ? positionId
              : undefined,
        });
        console.log('[schedule-monthly] request', {
          storeId,
          year,
          month,
          scope,
          positionId:
            positionId !== 'all' && workType === 'assigned'
              ? positionId
              : undefined,
        });
        console.log('[schedule-monthly] response', data);
        const { entries, schedules } = mapScheduleEntries({
          data,
          markAsMine: false,
          positions,
        });
        logUnmappedSchedules(entries);
        let nextSchedules = schedules;

        if (scope === 'mine' && schedules.length > 0) {
          const dates = getUniqueScheduleDates(schedules);
          const dailyResults = await Promise.all(
            dates.map(async (date) => {
              const response = await getDailySchedules({
                storeId,
                date,
                positionId:
                  positionId !== 'all' && workType === 'assigned'
                    ? positionId
                    : undefined,
              });

              return mapScheduleEntries({
                data: response.data,
                fallbackDate: date,
                markAsMine: false,
                positions,
              }).schedules;
            }),
          );
          const hydratedSchedules = dailyResults
            .flat()
            .filter((schedule) => isMySchedule(schedule, userName));

          if (hydratedSchedules.length > 0) {
            nextSchedules = hydratedSchedules;
          }
        }

        console.log('[schedule-monthly] mapped', nextSchedules);

        setAssignedSchedules(nextSchedules);
      } catch (error) {
        console.log('[schedule-monthly] failed', error);
        setAssignedSchedules([]);
      } finally {
        setAssignedSchedulesLoaded(true);
      }
    };

    fetchMonthlySchedules();
  }, [
    access.loaded,
    currentMonth,
    isFocused,
    positionId,
    positions,
    scheduleRefreshKey,
    storeId,
    userName,
    viewType,
    workType,
  ]);

  useEffect(() => {
    if (!notificationScheduleId || !shouldOpenNotificationScheduleModal) {
      handledNotificationScheduleIdRef.current = null;
      return;
    }

    if (handledNotificationScheduleIdRef.current === notificationScheduleId) {
      return;
    }

    if (
      !storeId ||
      !isFocused ||
      !assignedSchedulesLoaded
    ) {
      return;
    }

    const targetSchedule = assignedSchedules.find(
      (schedule) => schedule.id === notificationScheduleId,
    );
    handledNotificationScheduleIdRef.current = notificationScheduleId;

    if (!targetSchedule) {
      return;
    }

    setCurrentMonth(getMonthStart(targetSchedule.date));
    setSelectedDate(targetSchedule.date);
    setSelectedSchedule(targetSchedule);
    setDateDetailVisible(false);
    setFormVisible(true);
  }, [
    assignedSchedules,
    assignedSchedulesLoaded,
    isFocused,
    notificationScheduleId,
    shouldOpenNotificationScheduleModal,
    storeId,
  ]);

  useEffect(() => {
    if (
      !storeId ||
      !isFocused ||
      !access.loaded ||
      !dateDetailVisible ||
      workType !== 'assigned'
    ) {
      return;
    }

    const fetchDailySchedules = async () => {
      try {
        setDailyAssignedDate(selectedDate);
        setDailyAssignedSchedules([]);
        const { data } = await getDailySchedules({
          storeId,
          date: selectedDate,
          positionId:
            positionId !== 'all' && workType === 'assigned'
              ? positionId
              : undefined,
        });
        const { schedules } = mapScheduleEntries({
          data,
          fallbackDate: selectedDate,
          markAsMine: false,
          positions,
        });

        setDailyAssignedDate(selectedDate);
        setDailyAssignedSchedules(schedules);
      } catch {
        setDailyAssignedDate(null);
        setDailyAssignedSchedules([]);
      }
    };

    fetchDailySchedules();
  }, [
    access.loaded,
    dateDetailVisible,
    isFocused,
    positionId,
    positions,
    scheduleRefreshKey,
    selectedDate,
    storeId,
    viewType,
    workType,
  ]);

  const filteredSchedules = useMemo(() => {
    const sourceSchedules =
      workType === 'unavailable'
        ? unavailableSchedules
        : assignedSchedules;
    const selectedPosition = positions.find(
      (position) => position.id === positionId,
    );

    return sourceSchedules.filter((schedule) => {
      if (viewType === 'mine' && !isMySchedule(schedule, userName)) {
        return false;
      }

      if (
        workType === 'assigned' &&
        positionId !== 'all' &&
        !matchesPositionFilter(schedule, selectedPosition)
      ) {
        return false;
      }

      return schedule.date.startsWith(currentMonth.slice(0, 7));
    });
  }, [
    assignedSchedules,
    currentMonth,
    positionId,
    positions,
    unavailableSchedules,
    userName,
    viewType,
    workType,
  ]);

  const schedulesByDate = useMemo(
    () => groupSchedulesByDate(filteredSchedules),
    [filteredSchedules],
  );

  const canEditScheduleItem = (schedule: ScheduleItem) => {
    if (isUnavailableSchedule(schedule)) {
      return isMySchedule(schedule, userName);
    }

    return canEditSchedule;
  };

  const canDeleteUnavailable = (schedule: ScheduleItem) =>
    isUnavailableSchedule(schedule) && isMySchedule(schedule, userName);

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
    !!storeId && (workType === 'unavailable' || canEditSchedule);

  const handlePressSchedule = (scheduleId: string) => {
    const schedule = filteredSchedules.find((item) => item.id === scheduleId);

    if (!schedule) {
      return;
    }

    setSelectedDate(schedule.date);
    setDateDetailVisible(true);
  };

  const handlePressDate = (date: string) => {
    setSelectedDate(date);
    setDateDetailVisible(true);
  };

  const selectedDateBaseSchedules =
    workType === 'assigned'
      ? dailyAssignedDate === selectedDate
        ? dailyAssignedSchedules
        : []
      : schedulesByDate[selectedDate] ?? [];
  const selectedDatePosition = positions.find(
    (position) => position.id === positionId,
  );
  const selectedDateSchedules = selectedDateBaseSchedules.filter((schedule) => {
    if (viewType === 'mine' && !isMySchedule(schedule, userName)) {
      return false;
    }

    if (
      workType === 'assigned' &&
      positionId !== 'all' &&
      !matchesPositionFilter(schedule, selectedDatePosition)
    ) {
      return false;
    }

    return true;
  });

  if (!access.loaded) {
    return (
      <PageLayout
        showHeader={false}
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
      showHeader={false}
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
        positions={positions}
        onChangeViewType={setViewType}
        onChangeWorkType={setWorkType}
        onChangePosition={setPositionId}
        canManagePosition={canEditSchedule}
        canSelectAllView={canSelectAllView}
        showPositionFilter={workType === 'assigned' && viewType === 'all'}
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
            if (workType === 'unavailable') {
              setUnavailableFormVisible(true);
              return;
            }

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
        storeId={storeId}
        date={selectedDate}
        schedule={selectedSchedule}
        positions={positions}
        onClose={() => {
          setFormVisible(false);
          setSelectedSchedule(null);
        }}
        onCreated={(schedule) => {
          setAssignedSchedules((prev) => [...prev, schedule]);
          setSelectedDate(schedule.date);
          setCurrentMonth(getMonthStart(schedule.date));
          setScheduleRefreshKey((prev) => prev + 1);
        }}
        onUpdated={(updatedSchedule) => {
          setAssignedSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
            ),
          );
          setDailyAssignedSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
            ),
          );
          setSelectedSchedule(null);
          setSelectedDate(updatedSchedule.date);
          setCurrentMonth(getMonthStart(updatedSchedule.date));
          setScheduleRefreshKey((prev) => prev + 1);
        }}
        onDeleted={(scheduleId) => {
          setAssignedSchedules((prev) =>
            prev.filter((schedule) => schedule.id !== scheduleId),
          );
          setDailyAssignedSchedules((prev) =>
            prev.filter((schedule) => schedule.id !== scheduleId),
          );
          setSelectedSchedule(null);
          setScheduleRefreshKey((prev) => prev + 1);
        }}
      />

      <ScheduleUnavailableFormBottomSheet
        visible={unavailableFormVisible}
        memberName={userName}
        onClose={() => setUnavailableFormVisible(false)}
        onCreated={(schedule) => {
          setUnavailableSchedules((prev) => [...prev, schedule]);
          setSelectedDate(schedule.date);
          setCurrentMonth(getMonthStart(schedule.date));
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
                schedule.id !== scheduleId || !isMySchedule(schedule, userName),
            ),
          );
        }}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F1F1F6',
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
