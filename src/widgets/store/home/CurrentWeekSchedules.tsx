import { FlatList, StyleSheet, View } from 'react-native';

import {
  spacingSpacing16,
  spacingSpacing30,
  typoColorPrimary,
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
            workDate={item.date}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <NText variant="m12" style={styles.emptyText}>
              이번주 스케줄이 없습니다
            </NText>
          </View>
        )}
      />
    </View>
  );
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
  },
});
