import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import * as tokens from '@/src/init/styles/tokens';

import { ScheduleItem } from './mock';

type ScheduleBadgeProps = {
  schedule: ScheduleItem;
  compact?: boolean;
  compactLabel?: 'member' | 'time';
  compactStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
};

export default function ScheduleBadge({
  schedule,
  compact = false,
  compactLabel = 'member',
  compactStyle,
  backgroundColor,
}: ScheduleBadgeProps) {
  const positionName = schedule.positionName ?? '선택 안함';
  const compactText =
    compactLabel === 'time'
      ? getCompactTimeLabel(schedule)
      : schedule.memberName;

  return (
    <Text
      numberOfLines={1}
      allowFontScaling={false}
      style={[
        styles.badge,
        compact && styles.compact,
        compact && compactStyle,
        {
          backgroundColor:
            backgroundColor ?? schedule.positionColor ?? '#8D8D8D',
        },
      ]}
    >
      {compact ? compactText : `${schedule.memberName} · ${positionName}`}
    </Text>
  );
}

function getCompactTimeLabel(schedule: ScheduleItem) {
  if (isAllDayUnavailable(schedule)) {
    return '종일';
  }

  return `${getTimeHour(schedule.startTime)}-${getTimeHour(schedule.endTime)}`;
}

function getTimeHour(time: string) {
  const match = time.trim().match(/^(\d{1,2}):\d{2}/);

  if (!match) {
    return '00';
  }

  return match[1].padStart(2, '0');
}

function isAllDayUnavailable(schedule: ScheduleItem) {
  const startTime = schedule.startTime.slice(0, 5);
  const endTime = schedule.endTime.slice(0, 5);

  return (
    schedule.positionId === 'unavailable' &&
    startTime === '00:00' &&
    (endTime === '23:59' || endTime === '24:00')
  );
}

const styles = StyleSheet.create({
  badge: {
    overflow: 'hidden',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    color: tokens.basicColorWhiteBase,
    fontSize: tokens.typographyPrimitiveFontSize10,
    lineHeight: tokens.typographyPrimitiveLineHeight12,
    fontWeight: '700',
  },
  compact: {
    width: 46,
    height: 18,
    paddingHorizontal: 3,
    paddingVertical: 0,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: tokens.typographyPrimitiveLineHeight18,
    letterSpacing: 0,
    textAlign: 'center',
  },
});
