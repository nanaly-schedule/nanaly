import { FlatList, StyleSheet, View } from 'react-native';

import {
  spacingSpacing16,
  spacingSpacing30,
  typoColorPrimary,
  typoColorSub2,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

import ScheduleCard from './ScheduleCard';

type Schedule = {
  scheduleId: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  status: 'current' | 'upcoming';
};

interface CurrentWeekSchedulesProps {
  schedules: Schedule[];
}

export default function CurrentWeekSchedules({
  schedules,
}: CurrentWeekSchedulesProps) {
  return (
    <View style={styles.container}>
      <NText variant="b14" style={styles.title}>
        이번주 근무 일정
      </NText>
      <FlatList
        contentContainerStyle={{ flex: 1 }}
        horizontal
        data={schedules}
        keyExtractor={(item) => item.scheduleId}
        renderItem={({ item }) => (
          <ScheduleCard
            isCurrent={item.status === 'current'}
            startTime={item.startTime}
            endTime={item.endTime}
            totalTime={`총 ${item.totalHours}시간`}
            workDate={formatWorkDate(item.date, item.dayOfWeek)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <NText variant="m12" style={styles.emptyText}>
              등록된 일정이 없어요
            </NText>
          </View>
        )}
      />
    </View>
  );
}

function formatWorkDate(date: string, dayOfWeek: string) {
  const match = date.match(/^\d{4}[-.](\d{1,2})[-.](\d{1,2})/);

  if (!match) {
    return date;
  }

  const [, month, day] = match;
  const weekday = dayOfWeek.endsWith('요일') ? dayOfWeek : `${dayOfWeek}요일`;

  return `${Number(month)}월 ${Number(day)}일 ${weekday}`;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacingSpacing30,
  },
  title: {
    color: typoColorPrimary,
    marginBottom: spacingSpacing16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 118,
  },
  emptyText: {
    textAlign: 'center',
    color: typoColorSub2,
  },
});
