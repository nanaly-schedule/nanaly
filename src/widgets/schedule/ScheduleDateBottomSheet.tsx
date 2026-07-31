import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as tokens from '@/src/init/styles/tokens';
import {
  typoColorPrimary,
  typoColorRed,
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
  loading?: boolean;
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
  loading = false,
  onClose,
  onPressSchedule,
  onPressDeleteUnavailable,
  canEditSchedule = () => false,
  canDeleteUnavailable = () => false,
  hasConflict = () => false,
}: ScheduleDateBottomSheetProps) {
  const isUnavailable = workType === 'unavailable';

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      style={styles.sheet}
      resizable
      minHeight={468}
      initialHeight={468}
    >
      <NText variant="b16" style={styles.title}>
        {formatDateTitle(date)}
      </NText>

      <View style={styles.list}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={tokens.brandColorPrimary}
            />
          </View>
        ) : schedules.length === 0 ? (
          <View style={styles.emptyContainer}>
            <NText variant="r14" style={styles.emptyText}>
              등록된 스케줄이 없어요
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
                      <Text style={styles.rowName}>{schedule.memberName}</Text>{' '}
                      · 근무불가 · {getScheduleTimeLabel(schedule)}
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
                      {getScheduleTimeLabel(schedule)}
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
                  <Image
                    source={require('@/src/shared/assets/arrow_btn.svg')}
                    style={styles.arrowIcon}
                    contentFit="contain"
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

function getScheduleTimeLabel(schedule: ScheduleItem) {
  if (isAllDayUnavailable(schedule)) {
    return '종일';
  }

  return `${schedule.startTime}~${schedule.endTime}`;
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
  sheet: {
    minHeight: 468,
    paddingHorizontal: 0,
    paddingTop: tokens.spacingSpacing8,
  },
  title: {
    color: '#333333',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
    marginLeft: tokens.spacingSpacing16,
    marginTop: 26,
    marginBottom: tokens.spacingSpacing30,
  },
  list: {
    flex: 1,
    gap: 10,
    marginHorizontal: tokens.spacingSpacing16,
  },
  row: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radiusRadius12,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing10,
  },
  rowText: {
    flex: 1,
    color: '#575757',
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: tokens.typographyPrimitiveFontSize14,
    lineHeight: tokens.typographyPrimitiveLineHeight16,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
  },
  rowName: {
    color: '#333333',
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: tokens.typographyPrimitiveFontSize14,
    lineHeight: tokens.typographyPrimitiveLineHeight16,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
  },
  unavailableText: {
    color: '#575757',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
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
  arrowIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: '-90deg' }],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    color: '#767676',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
});
