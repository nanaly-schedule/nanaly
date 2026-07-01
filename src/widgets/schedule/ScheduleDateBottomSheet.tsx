import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  typoColorPrimary,
  typoColorRed,
  typoColorSub2,
} from '@/src/init/styles/tokens';
import BottomSheet from '@/src/shared/ui/BottomSheet';
import NText from '@/src/shared/ui/NText';

import { ScheduleItem } from './mock';
import { ScheduleWorkType } from './ScheduleFilterBar';

type ScheduleDateBottomSheetProps = {
  visible: boolean;
  date: string;
  workType: ScheduleWorkType;
  schedules: ScheduleItem[];
  onClose: () => void;
  onPressSchedule?: (schedule: ScheduleItem) => void;
  onPressDeleteUnavailable?: (scheduleId: string) => void;
  canEditSchedule?: (schedule: ScheduleItem) => boolean;
  canDeleteUnavailable?: (schedule: ScheduleItem) => boolean;
  hasConflict?: (schedule: ScheduleItem) => boolean;
};

function formatDateTitle(dateString: string) {
  const [, month, day] = dateString.split('-').map(Number);

  return `${month}월 ${day}일`;
}

export default function ScheduleDateBottomSheet({
  visible,
  date,
  workType,
  schedules,
  onClose,
  onPressSchedule,
  onPressDeleteUnavailable,
  canEditSchedule = () => false,
  canDeleteUnavailable = () => false,
  hasConflict = () => false,
}: ScheduleDateBottomSheetProps) {
  const isUnavailable = workType === 'unavailable';

  return (
    <BottomSheet visible={visible} onClose={onClose} style={styles.sheet}>
      <NText variant="b16" style={styles.title}>
        {formatDateTitle(date)}
      </NText>

      <View style={styles.list}>
        {schedules.length === 0 ? (
          <View style={styles.emptyRow}>
            <NText variant="r14" style={styles.emptyText}>
              등록된 {isUnavailable ? '근무불가' : '근무'}가 없어요
            </NText>
          </View>
        ) : (
          schedules.map((schedule) => {
            const isEditable = canEditSchedule(schedule);
            const canDelete = canDeleteUnavailable(schedule);
            const isConflict = hasConflict(schedule);

            return (
              <Pressable
                key={schedule.id}
                disabled={!isEditable}
                style={styles.row}
                onPress={() => onPressSchedule?.(schedule)}
              >
                {isUnavailable ? (
                  <View style={styles.rowText}>
                    <NText variant="r14" style={styles.unavailableText}>
                      <Text style={styles.rowName}>{schedule.memberName}</Text>
                      {' '}
                        · 근무불가 · {schedule.startTime}~{schedule.endTime}
                    </NText>
                    {isConflict && (
                      <NText variant="r12" style={styles.conflictText}>
                        스케줄 겹침
                      </NText>
                    )}
                  </View>
                ) : (
                  <Text style={styles.rowText}>
                    <Text style={styles.rowName}>{schedule.memberName}</Text>
                    <Text>
                      {' '}
                      · {schedule.positionName ?? '선택 안함'} ·{' '}
                      {schedule.startTime}~{schedule.endTime}
                    </Text>
                  </Text>
                )}

                {isUnavailable && canDelete && (
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => onPressDeleteUnavailable?.(schedule.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={typoColorPrimary}
                    />
                  </Pressable>
                )}
                {!isUnavailable && isEditable && (
                  <Ionicons
                    name="chevron-forward"
                    size={28}
                    color={typoColorPrimary}
                  />
                )}
              </Pressable>
            );
          })
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    minHeight: 468,
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  title: {
    color: typoColorPrimary,
    marginTop: 26,
    marginBottom: 54,
  },
  list: {
    gap: 18,
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingLeft: 8,
    paddingRight: 8,
  },
  rowText: {
    flex: 1,
    color: typoColorPrimary,
    fontSize: 14,
    lineHeight: 26,
  },
  rowName: {
    fontWeight: '700',
  },
  unavailableText: {
    color: typoColorPrimary,
  },
  conflictText: {
    color: typoColorRed,
    marginTop: 2,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRow: {
    minHeight: 38,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  emptyText: {
    color: typoColorSub2,
  },
});
