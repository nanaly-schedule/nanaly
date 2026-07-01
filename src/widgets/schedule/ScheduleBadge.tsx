import { StyleSheet, Text } from 'react-native';

import { ScheduleItem } from './mock';

type ScheduleBadgeProps = {
  schedule: ScheduleItem;
  compact?: boolean;
  compactLabel?: 'member' | 'time';
};

export default function ScheduleBadge({
  schedule,
  compact = false,
  compactLabel = 'member',
}: ScheduleBadgeProps) {
  const positionName = schedule.positionName ?? '선택 안함';
  const compactText =
    compactLabel === 'time'
      ? `${schedule.startTime.slice(0, 2)}-${schedule.endTime.slice(0, 2)}`
      : schedule.memberName;

  return (
    <Text
      numberOfLines={1}
      style={[
        styles.badge,
        compact && styles.compact,
        { backgroundColor: schedule.positionColor ?? '#8D8D8D' },
      ]}
    >
      {compact ? compactText : `${schedule.memberName} · ${positionName}`}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    overflow: 'hidden',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  compact: {
    width: 46,
    height: 18,
    paddingHorizontal: 3,
    paddingVertical: 0,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
