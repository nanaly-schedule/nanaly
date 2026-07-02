import { Pressable, StyleSheet, Text, View } from 'react-native';

import { basicColorBluegrey100 } from '@/src/init/styles/tokens';

import { ScheduleItem } from './mock';
import ScheduleBadge from './ScheduleBadge';

type CalendarDate = {
  dateString: string;
  day: number;
};

type ScheduleCalendarDayProps = {
  date?: CalendarDate;
  state?: string;
  schedules: ScheduleItem[];
  selected?: boolean;
  compactLabel?: 'member' | 'time';
  onPressDate: (dateString: string) => void;
  onPressSchedule: (scheduleId: string) => void;
};

function getLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDayOfWeek(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);

  return new Date(year, month - 1, day).getDay();
}

export default function ScheduleCalendarDay({
  date,
  state,
  schedules,
  selected,
  compactLabel = 'member',
  onPressDate,
  onPressSchedule,
}: ScheduleCalendarDayProps) {
  if (!date) {
    return <View style={styles.container} />;
  }

  const isSunday = getDayOfWeek(date.dateString) === 0;
  const isToday = date.dateString === getLocalDateString(new Date());

  return (
    <Pressable
      style={[
        styles.container,
        isToday && styles.today,
        selected && !isToday && styles.selected,
      ]}
      onPress={() => onPressDate(date.dateString)}
    >
      <Text
        style={[
          styles.day,
          isSunday && styles.sundayDay,
          state === 'disabled' && styles.disabledDay,
          selected && styles.selectedDay,
        ]}
      >
        {date.day}
      </Text>

      <View style={styles.badges}>
        {schedules.slice(0, 3).map((schedule) => (
          <Pressable
            key={schedule.id}
            onPress={() => onPressSchedule(schedule.id)}
          >
            <ScheduleBadge
              schedule={schedule}
              compact
              compactLabel={compactLabel}
            />
          </Pressable>
        ))}
        {schedules.length > 3 && <Text style={styles.moreText}>...</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 49,
    height: 100,
    alignItems: 'center',
    paddingTop: 5,
  },
  today: {
    backgroundColor: basicColorBluegrey100,
  },
  selected: {
    backgroundColor: basicColorBluegrey100,
  },
  day: {
    color: '#333333',
    fontSize: 12,
    lineHeight: 15,
  },
  sundayDay: {
    color: '#FF3B30',
  },
  disabledDay: {
    color: '#A5A5A5',
  },
  selectedDay: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  badges: {
    width: 46,
    alignItems: 'center',
    gap: 2,
    marginTop: 5,
  },
  moreText: {
    color: '#A5A5A5',
    fontSize: 12,
    lineHeight: 12,
    textAlign: 'center',
  },
});
