import { Pressable, StyleSheet, Text, View } from 'react-native';

import * as tokens from '@/src/init/styles/tokens';
import { backgroundColorPrimary } from '@/src/init/styles/tokens';

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
  dayWidth?: number;
  dayHeight?: number;
  tablet?: boolean;
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
  dayWidth = 49,
  dayHeight = 100,
  tablet = false,
  onPressDate,
  onPressSchedule,
}: ScheduleCalendarDayProps) {
  if (!date) {
    return (
      <View
        style={[styles.container, { width: dayWidth, height: dayHeight }]}
      />
    );
  }

  const isSunday = getDayOfWeek(date.dateString) === 0;
  const isToday = date.dateString === getLocalDateString(new Date());
  const scale = tablet ? Math.max(1, dayWidth / 49) : 1;
  const badgeWidth = tablet ? 94 : 46;
  const badgeHeight = tablet ? 32 : 18;
  const badgesGap = tablet ? 8 : 2;
  const badgesTop = tablet ? Math.max(10, 5 * scale) : 5;

  return (
    <Pressable
      style={[styles.container, { width: dayWidth, height: dayHeight }]}
      onPress={() => onPressDate(date.dateString)}
    >
      <View
        style={[
          styles.dateContent,
          {
            width: dayWidth,
            height: dayHeight,
          },
          selected && styles.selected,
        ]}
      >
        <Text
          style={[
            styles.day,
            isSunday && styles.sundayDay,
            state === 'disabled' && styles.disabledDay,
            isToday && styles.todayDay,
          ]}
        >
          {date.day}
        </Text>

        <View
          style={[
            styles.badges,
            {
              width: badgeWidth,
              gap: badgesGap,
              marginTop: badgesTop,
            },
          ]}
        >
          {schedules.slice(0, 3).map((schedule) => (
            <Pressable
              key={schedule.id}
              onPress={() => onPressSchedule(schedule.id)}
            >
              <ScheduleBadge
                schedule={schedule}
                compact
                compactLabel={compactLabel}
                compactStyle={{
                  width: badgeWidth,
                  height: badgeHeight,
                  lineHeight: badgeHeight,
                }}
              />
            </Pressable>
          ))}
          {schedules.length > 3 && <Text style={styles.moreText}>...</Text>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dateContent: {
    alignItems: 'center',
    paddingTop: 5,
  },
  selected: {
    backgroundColor: backgroundColorPrimary,
  },
  day: {
    color: tokens.typoColorPrimary,
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: 15,
  },
  sundayDay: {
    color: '#FF3B30',
  },
  disabledDay: {
    color: tokens.typoColorPlaceholder,
  },
  todayDay: {
    color: tokens.brandColorPrimary,
  },
  badges: {
    alignItems: 'center',
  },
  moreText: {
    color: tokens.typoColorPlaceholder,
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: tokens.typographyPrimitiveLineHeight12,
    textAlign: 'center',
  },
});
