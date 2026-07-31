import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import * as tokens from '@/src/init/styles/tokens';

import { ScheduleItem } from './mock';
import ScheduleCalendarDay from './ScheduleCalendarDay';

type ScheduleCalendarProps = {
  currentMonth: string;
  selectedDate: string;
  schedulesByDate: Record<string, ScheduleItem[]>;
  compactLabel?: 'member' | 'time';
  badgeColor?: string;
  dayWidth?: number;
  dayHeight?: number;
  tablet?: boolean;
  dayHorizontalGap?: number;
  onPressDate: (dateString: string) => void;
  onPressSchedule: (scheduleId: string) => void;
};

export default function ScheduleCalendar({
  currentMonth,
  selectedDate,
  schedulesByDate,
  compactLabel = 'member',
  badgeColor,
  dayWidth,
  dayHeight,
  tablet = false,
  dayHorizontalGap = 0,
  onPressDate,
  onPressSchedule,
}: ScheduleCalendarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.weekHeader}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <Text
            key={day}
            style={[styles.weekText, index === 0 && styles.sundayText]}
          >
            {day}
          </Text>
        ))}
      </View>

      <Calendar
        key={currentMonth}
        style={styles.calendar}
        current={currentMonth}
        hideArrows
        hideDayNames
        hideExtraDays={false}
        firstDay={0}
        dayComponent={({ date, state }) => (
          <ScheduleCalendarDay
            date={date}
            state={state}
            selected={date?.dateString === selectedDate}
            schedules={date ? (schedulesByDate[date.dateString] ?? []) : []}
            compactLabel={compactLabel}
            badgeColor={badgeColor}
            dayWidth={dayWidth}
            dayHeight={dayHeight}
            tablet={tablet}
            onPressDate={onPressDate}
            onPressSchedule={onPressSchedule}
          />
        )}
        theme={{
          calendarBackground: 'transparent',
          backgroundColor: 'transparent',
          ['stylesheet.calendar.main' as never]: {
            container: {
              paddingLeft: 0,
              paddingRight: 0,
              backgroundColor: 'transparent',
            },
            monthView: {
              backgroundColor: 'transparent',
            },
            week: {
              marginTop: 0,
              marginBottom: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              columnGap: dayHorizontalGap,
              backgroundColor: 'transparent',
            },
          },
          ['stylesheet.calendar.header' as never]: {
            header: {
              height: 0,
              margin: 0,
              padding: 0,
              opacity: 0,
            },
            week: {
              height: 0,
              marginTop: 0,
              marginBottom: 0,
              opacity: 0,
            },
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 0,
    marginBottom: 2,
  },
  weekText: {
    flex: 1,
    color: tokens.typoColorSub2,
    fontSize: tokens.typographyPrimitiveFontSize12,
    fontWeight: '500',
    lineHeight: tokens.typographyPrimitiveLineHeight16,
    textAlign: 'center',
  },
  sundayText: {
    color: '#FF3B30',
  },
  calendar: {
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
});
