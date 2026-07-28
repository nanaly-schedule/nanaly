import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import DateWheelColumn from '@/src/features/auth/ui/DateWheelColumn';
import { createUnavailable } from '@/src/features/schedule/api/schedule';
import * as tokens from '@/src/init/styles/tokens';
import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius12,
  spacingSpacing20,
  typoColorPrimary,
  typoColorSub2,
} from '@/src/init/styles/tokens';
import {
  BirthDateValue,
  createNumberRange,
  formatBirthDate,
  getDaysInMonth,
  parseBirthDate,
} from '@/src/shared/lib/date';
import BaseModal from '@/src/shared/ui/BaseModal';
import BottomSheet from '@/src/shared/ui/BottomSheet';
import NText from '@/src/shared/ui/NText';

import { ScheduleItem } from './mock';

type ScheduleUnavailableFormBottomSheetProps = {
  visible: boolean;
  storeId: string;
  memberName: string;
  onClose: () => void;
  onCreated?: (schedule: ScheduleItem) => void;
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string'
    ) {
      return responseData.message;
    }

    return error.message;
  }

  return error instanceof Error ? error.message : fallback;
}

export default function ScheduleUnavailableFormBottomSheet({
  visible,
  storeId,
  memberName,
  onClose,
  onCreated,
}: ScheduleUnavailableFormBottomSheetProps) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [memo, setMemo] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<
    'start' | 'end' | null
  >(null);
  const [missingRequiredVisible, setMissingRequiredVisible] = useState(false);
  const [saveConfirmVisible, setSaveConfirmVisible] = useState(false);
  const [saveFailedVisible, setSaveFailedVisible] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] =
    useState('쉬는 날 신청에 실패했어요');
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const hasChanges = !!date || !!startTime || !!endTime || allDay || !!memo;
  const hasRequiredValues = !!date && (allDay || (!!startTime && !!endTime));

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDate('');
    setStartTime('');
    setEndTime('');
    setAllDay(false);
    setMemo('');
  }, [visible]);

  const handleClose = () => {
    if (hasChanges) {
      setExitConfirmVisible(true);
      return;
    }

    onClose();
  };

  const handleSave = () => {
    if (!hasRequiredValues) {
      setMissingRequiredVisible(true);
      return;
    }

    setSaveConfirmVisible(true);
  };

  const handleCreate = async () => {
    if (!storeId || saving) {
      return;
    }

    const nextStartTime = allDay ? '00:00' : startTime;
    const nextEndTime = allDay ? '23:59' : endTime;

    setSaving(true);

    try {
      const { data } = await createUnavailable(storeId, {
        date,
        isAllDay: allDay,
        startTime: nextStartTime,
        endTime: nextEndTime,
        reason: memo.trim(),
      });
      const createdId =
        data?.unAvailableId ??
        data?.unavailableId ??
        data?.id ??
        `unavailable-${Date.now()}`;

      setSaveConfirmVisible(false);
      onCreated?.({
        id: createdId,
        date,
        memberId: data?.memberId ?? 'me',
        memberName: data?.memberName ?? memberName ?? '나',
        positionId: 'unavailable',
        positionName: '쉬는 날',
        positionColor: '#FF6B6B',
        startTime: nextStartTime,
        endTime: nextEndTime,
        memo,
        isMine: true,
      });
      onClose();
    } catch (error) {
      setSaveConfirmVisible(false);
      setSaveErrorMessage(
        getApiErrorMessage(error, '쉬는 날 신청에 실패했어요'),
      );
      setSaveFailedVisible(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      showHandle={false}
      style={styles.sheet}
    >
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleClose}>
          <Ionicons name="chevron-back" size={20} color={typoColorPrimary} />
        </Pressable>
        <NText variant="b16" style={styles.title}>
          근무 불가
        </NText>
        <Pressable style={styles.headerButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color={typoColorPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <NText variant="r12" style={styles.sectionTitle}>
            날짜
          </NText>
          <TextInput
            value={formatDate(date)}
            placeholder="YYYY.MM.DD"
            placeholderTextColor={typoColorSub2}
            editable={false}
            onPressIn={() => setDatePickerVisible(true)}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <NText variant="r12" style={styles.sectionTitle}>
            시간
          </NText>
          <View style={styles.allDayRow}>
            <NText variant="r12" style={styles.timeLabel}>
              종일
            </NText>
            <Switch
              value={allDay}
              onValueChange={setAllDay}
              trackColor={{ false: '#E5E5EA', true: buttonColorCta }}
              thumbColor={tokens.basicColorWhiteBase}
              ios_backgroundColor="#E5E5EA"
            />
          </View>
          <View style={styles.timeRow}>
            <View style={styles.timeColumn}>
              <NText variant="r12" style={styles.timeLabel}>
                시작
              </NText>
              <TextInput
                value={startTime}
                placeholder="00:00"
                placeholderTextColor={typoColorSub2}
                editable={false}
                onPressIn={() => {
                  if (!allDay) {
                    setTimePickerTarget('start');
                  }
                }}
                style={[styles.input, allDay && styles.disabledInput]}
              />
            </View>
            <View style={styles.timeColumn}>
              <NText variant="r12" style={styles.timeLabel}>
                종료
              </NText>
              <TextInput
                value={endTime}
                placeholder="00:00"
                placeholderTextColor={typoColorSub2}
                editable={false}
                onPressIn={() => {
                  if (!allDay) {
                    setTimePickerTarget('end');
                  }
                }}
                style={[styles.input, allDay && styles.disabledInput]}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <NText variant="r12" style={styles.sectionTitle}>
            사유
          </NText>
          <TextInput
            value={memo}
            multiline
            placeholder="사유를 입력해 주세요"
            placeholderTextColor={typoColorSub2}
            onChangeText={setMemo}
            style={[styles.input, styles.memoInput]}
          />
        </View>
      </View>

      <ScheduleUnavailableDatePickerBottomSheet
        visible={datePickerVisible}
        value={parseBirthDate(date)}
        onClose={() => setDatePickerVisible(false)}
        onChange={(nextDate) => {
          setDate(formatBirthDate(nextDate));
          setDatePickerVisible(false);
        }}
      />
      <ScheduleUnavailableTimePickerBottomSheet
        visible={!!timePickerTarget}
        value={timePickerTarget === 'end' ? endTime : startTime}
        onClose={() => setTimePickerTarget(null)}
        onChange={(nextTime) => {
          if (timePickerTarget === 'end') {
            setEndTime(nextTime);
          } else {
            setStartTime(nextTime);
          }
          setTimePickerTarget(null);
        }}
      />

      <BaseModal
        visible={saveConfirmVisible}
        onClose={() => setSaveConfirmVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>쉬는 날을 추가할까요?</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setSaveConfirmVisible(false)}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button onPress={handleCreate}>
            {saving ? '추가중' : '추가하기'}
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>

      <BaseModal
        visible={exitConfirmVisible}
        onClose={() => setExitConfirmVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>저장하지 않고 나갈까요?</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setExitConfirmVisible(false)}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button
            onPress={() => {
              setExitConfirmVisible(false);
              onClose();
            }}
          >
            마무리
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>

      <BaseModal
        visible={missingRequiredVisible}
        onClose={() => setMissingRequiredVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>입력되지 않은 항목이 있어요</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            fullWidth
            onPress={() => setMissingRequiredVisible(false)}
          >
            확인
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
      <BaseModal
        visible={saveFailedVisible}
        onClose={() => setSaveFailedVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Title>저장에 실패했어요</BaseModal.Title>
          <BaseModal.Text>{saveErrorMessage}</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            fullWidth
            onPress={() => setSaveFailedVisible(false)}
          >
            확인
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </BottomSheet>
  );
}

function formatDate(date: string) {
  return date.split('-').join('.');
}

function getDefaultDateValue(): BirthDateValue {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function ScheduleUnavailableDatePickerBottomSheet({
  visible,
  value,
  onClose,
  onChange,
}: {
  visible: boolean;
  value: BirthDateValue | null;
  onClose: () => void;
  onChange: (value: BirthDateValue) => void;
}) {
  const [draft, setDraft] = useState<BirthDateValue>(getDefaultDateValue());
  const years = createNumberRange(1998, 2030);
  const months = createNumberRange(1, 12);
  const days = createNumberRange(1, getDaysInMonth(draft.year, draft.month));

  useEffect(() => {
    if (visible) {
      setDraft(value ?? getDefaultDateValue());
    }
  }, [value, visible]);

  const updateDraft = (nextValue: Partial<BirthDateValue>) => {
    setDraft((prev) => {
      const next = { ...prev, ...nextValue };
      const maxDay = getDaysInMonth(next.year, next.month);

      return {
        ...next,
        day: Math.min(next.day, maxDay),
      };
    });
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      showBackdrop={false}
      style={styles.wheelSheet}
    >
      <View style={styles.wheelRow}>
        <DateWheelColumn
          items={years}
          selectedValue={draft.year}
          formatLabel={(year) => `${year}년`}
          onChange={(year) => updateDraft({ year })}
        />
        <DateWheelColumn
          items={months}
          selectedValue={draft.month}
          formatLabel={(month) => `${month}월`}
          onChange={(month) => updateDraft({ month })}
        />
        <DateWheelColumn
          items={days}
          selectedValue={draft.day}
          formatLabel={(day) => `${String(day).padStart(2, '0')}일`}
          onChange={(day) => updateDraft({ day })}
        />
      </View>
      <ConfirmButton onPress={() => onChange(draft)} />
    </BottomSheet>
  );
}

function ScheduleUnavailableTimePickerBottomSheet({
  visible,
  value,
  onClose,
  onChange,
}: {
  visible: boolean;
  value: string;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState({ hour: 0, minute: 0 });
  const hours = createNumberRange(0, 23);
  const minutes = createNumberRange(0, 59);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const [hour, minute] = value ? value.split(':').map(Number) : [0, 0];

    setDraft({
      hour: Number.isFinite(hour) ? hour : 0,
      minute: Number.isFinite(minute) ? minute : 0,
    });
  }, [value, visible]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      showBackdrop={false}
      style={styles.wheelSheet}
    >
      <View style={styles.wheelRow}>
        <DateWheelColumn
          items={hours}
          selectedValue={draft.hour}
          formatLabel={(hour) => `${String(hour).padStart(2, '0')}시`}
          onChange={(hour) => setDraft((prev) => ({ ...prev, hour }))}
        />
        <DateWheelColumn
          items={minutes}
          selectedValue={draft.minute}
          formatLabel={(minute) => `${String(minute).padStart(2, '0')}분`}
          onChange={(minute) => setDraft((prev) => ({ ...prev, minute }))}
        />
      </View>
      <ConfirmButton
        onPress={() =>
          onChange(
            `${String(draft.hour).padStart(2, '0')}:${String(
              draft.minute,
            ).padStart(2, '0')}`,
          )
        }
      />
    </BottomSheet>
  );
}

function ConfirmButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.confirmButton} onPress={onPress}>
      <NText variant="m16" style={styles.confirmText}>
        확인
      </NText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheet: {
    maxHeight: '92%',
    paddingHorizontal: tokens.spacingSpacing16,
    paddingTop: tokens.spacingSpacing8,
    paddingBottom: 32,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -10,
    marginBottom: tokens.spacingSpacing16,
  },
  headerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: typoColorPrimary,
  },
  content: {
    paddingBottom: tokens.spacingSpacing20,
  },
  section: {
    marginBottom: tokens.spacingSpacing20,
  },
  sectionTitle: {
    color: typoColorPrimary,
    marginBottom: tokens.spacingSpacing10,
  },
  input: {
    height: 44,
    borderRadius: tokens.radiusRadius8,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing12,
    color: typoColorPrimary,
    fontSize: tokens.typographyPrimitiveFontSize12,
  },
  disabledInput: {
    backgroundColor: tokens.borderDividerPrimary,
    color: typoColorSub2,
  },
  memoInput: {
    height: 76,
    paddingTop: tokens.spacingSpacing12,
    textAlignVertical: 'top',
  },
  allDayRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingSpacing8,
  },
  timeRow: {
    flexDirection: 'row',
    gap: tokens.spacingSpacing12,
  },
  timeColumn: {
    flex: 1,
    gap: tokens.spacingSpacing8,
  },
  timeLabel: {
    color: typoColorPrimary,
  },
  wheelSheet: {
    paddingHorizontal: tokens.spacingSpacing20,
    paddingTop: tokens.spacingSpacing12,
  },
  wheelRow: {
    flexDirection: 'row',
    gap: spacingSpacing20,
    marginBottom: spacingSpacing20,
  },
  confirmButton: {
    height: 46,
    borderRadius: radiusRadius12,
    backgroundColor: buttonColorCta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: backgroundColorWhite,
  },
});
