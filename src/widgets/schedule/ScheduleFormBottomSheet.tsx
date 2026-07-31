import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { getMemberRoleLabel, MemberRole } from '@/src/entities/member/member';
import DateWheelColumn from '@/src/features/auth/ui/DateWheelColumn';
import {
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from '@/src/features/schedule/api/schedule';
import { getMembers } from '@/src/features/store/api/member';
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

import TitleButton from '../store/TitleButton';
import {
  MOCK_MEMBERS,
  ScheduleItem,
  ScheduleMember,
  SchedulePosition,
} from './mock';

type ScheduleFormBottomSheetProps = {
  visible: boolean;
  storeId: string;
  date: string;
  positions: SchedulePosition[];
  schedule?: ScheduleItem | null;
  onClose: () => void;
  onCreated?: (schedule: ScheduleItem) => void;
  onUpdated?: (schedule: ScheduleItem) => void;
  onDeleted?: (scheduleId: string) => void;
};

type StoreMemberResponse = {
  id?: string;
  memberId?: string;
  name: string;
  role?: MemberRole;
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

export default function ScheduleFormBottomSheet({
  visible,
  storeId,
  date,
  positions,
  schedule,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: ScheduleFormBottomSheetProps) {
  const isCreateMode = !schedule;
  const [isEditMode, setIsEditMode] = useState(false);
  const isFormMode = isCreateMode || isEditMode;
  const [selectedMember, setSelectedMember] = useState<ScheduleMember | null>(
    null,
  );
  const [selectedPosition, setSelectedPosition] =
    useState<SchedulePosition | null>(null);
  const [positionCleared, setPositionCleared] = useState(false);
  const [memberPickerVisible, setMemberPickerVisible] = useState(false);
  const [positionPickerVisible, setPositionPickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<
    'start' | 'end' | null
  >(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [saveConfirmVisible, setSaveConfirmVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);
  const [missingRequiredVisible, setMissingRequiredVisible] = useState(false);
  const [saveFailedVisible, setSaveFailedVisible] = useState(false);
  const [failedTitle, setFailedTitle] = useState('저장에 실패했어요');
  const [saveErrorMessage, setSaveErrorMessage] =
    useState('일하는 날 등록에 실패했어요');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [members, setMembers] = useState<ScheduleMember[]>(MOCK_MEMBERS);
  const memberName = selectedMember?.name ?? schedule?.memberName ?? '지정안됨';
  const positionName = positionCleared
    ? '지정안됨'
    : (selectedPosition?.name ?? schedule?.positionName ?? '지정안됨');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [memo, setMemo] = useState('');
  const displayDate = isFormMode
    ? selectedDate
    : (schedule?.date ?? selectedDate);
  const scheduleMember = members.find(
    (member) =>
      member.id === schedule?.memberId || member.name === schedule?.memberName,
  );
  const selectedMemberId =
    selectedMember?.id ?? scheduleMember?.id ?? schedule?.memberId ?? null;
  const selectedPositionId = positionCleared
    ? null
    : (selectedPosition?.id ?? schedule?.positionId ?? null);
  const hasChanges =
    !!selectedMember ||
    !!selectedPosition ||
    !!selectedDate ||
    !!startTime ||
    !!endTime ||
    !!memo;
  const hasEditChanges =
    !!schedule &&
    (selectedMemberId !== schedule.memberId ||
      selectedPositionId !== (schedule.positionId ?? null) ||
      selectedDate !== schedule.date ||
      startTime !== schedule.startTime ||
      endTime !== schedule.endTime ||
      memo !== (schedule.memo ?? ''));
  const hasRequiredValues =
    !!selectedMemberId && !!displayDate && !!startTime && !!endTime;

  const handleClose = () => {
    if (menuVisible) {
      setMenuVisible(false);
      return;
    }

    if (isEditMode) {
      if (hasEditChanges) {
        setExitConfirmVisible(true);
        return;
      }

      setIsEditMode(false);
      return;
    }

    if (isCreateMode && hasChanges) {
      setExitConfirmVisible(true);
      return;
    }

    onClose();
  };

  const discardEditChanges = () => {
    const originalPosition =
      positions.find((position) => position.id === schedule?.positionId) ??
      null;

    setSelectedMember(null);
    setSelectedPosition(originalPosition);
    setPositionCleared(false);
    setSelectedDate(schedule?.date ?? '');
    setStartTime(schedule?.startTime ?? '');
    setEndTime(schedule?.endTime ?? '');
    setMemo(schedule?.memo ?? '');
    setExitConfirmVisible(false);
    setIsEditMode(false);
  };

  const handleSave = () => {
    if (!hasRequiredValues) {
      setMissingRequiredVisible(true);
      return;
    }

    setSaveConfirmVisible(true);
  };

  const getCurrentSchedulePayload = () => ({
    memberId: selectedMemberId ?? '',
    positionId: selectedPositionId,
    date: displayDate,
    startTime,
    endTime,
    memo: memo.trim() ? memo.trim() : null,
  });

  const handleCreateSchedule = async () => {
    if (!selectedMember || saving) {
      return;
    }

    setSaving(true);

    try {
      const positionId = selectedPosition?.id ?? null;
      const payload = getCurrentSchedulePayload();

      const { data } = await createSchedule(storeId, payload);
      const createdId =
        data?.scheduleId ?? data?.id ?? `schedule-${Date.now()}`;

      setSaveConfirmVisible(false);
      onCreated?.({
        id: createdId,
        date: displayDate,
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        positionId,
        positionName: positionId ? (selectedPosition?.name ?? null) : null,
        positionColor: positionId ? (selectedPosition?.color ?? null) : null,
        startTime,
        endTime,
        memo,
      });
      onClose();
    } catch (error) {
      setSaveConfirmVisible(false);
      setFailedTitle('저장에 실패했어요');
      setSaveErrorMessage(
        getApiErrorMessage(error, '일하는 날 등록에 실패했어요'),
      );
      setSaveFailedVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSchedule = async () => {
    if (!schedule || !selectedMemberId || saving) {
      return;
    }

    setSaving(true);

    try {
      const positionId = selectedPositionId;
      const payload = getCurrentSchedulePayload();

      await updateSchedule(storeId, schedule.id, payload);
      setSaveConfirmVisible(false);
      const updatedSchedule: ScheduleItem = {
        ...schedule,
        date: displayDate,
        memberId: selectedMemberId,
        memberName,
        positionId,
        positionName: positionId ? positionName : null,
        positionColor: positionId
          ? (selectedPosition?.color ?? schedule.positionColor ?? null)
          : null,
        startTime,
        endTime,
        memo,
      };

      onUpdated?.(updatedSchedule);
      setIsEditMode(false);
      onClose();
    } catch (error) {
      setSaveConfirmVisible(false);
      setFailedTitle('수정에 실패했어요');
      setSaveErrorMessage(
        getApiErrorMessage(error, '일하는 날 수정에 실패했어요'),
      );
      setSaveFailedVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!schedule || deleting) {
      return;
    }

    setDeleting(true);

    try {
      await deleteSchedule(storeId, schedule.id);
      setDeleteConfirmVisible(false);
      onDeleted?.(schedule.id);
      onClose();
    } catch (error) {
      setDeleteConfirmVisible(false);
      setFailedTitle('삭제에 실패했어요');
      setSaveErrorMessage(
        getApiErrorMessage(error, '일하는 날 삭제에 실패했어요'),
      );
      setSaveFailedVisible(true);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    const nextPosition =
      positions.find((position) => position.id === schedule?.positionId) ??
      null;

    setSelectedMember(null);
    setSelectedPosition(nextPosition);
    setPositionCleared(false);
    setStartTime(schedule?.startTime ?? '');
    setEndTime(schedule?.endTime ?? '');
    setSelectedDate(schedule?.date ?? '');
    setMemo(schedule?.memo ?? '');
    setMenuVisible(false);
    setIsEditMode(false);
  }, [date, positions, schedule, visible]);

  useEffect(() => {
    if (!visible || !storeId) {
      return;
    }

    const fetchMembers = async () => {
      try {
        const { data } = await getMembers(storeId);
        const nextMembers = (data as StoreMemberResponse[]).reduce<
          ScheduleMember[]
        >((acc, member) => {
          const id = member.memberId ?? member.id;

          if (!id) {
            return acc;
          }

          return [
            ...acc,
            {
              id,
              name: member.name,
              roleName: member.role ? getMemberRoleLabel(member.role) : '',
            },
          ];
        }, []);

        setMembers(nextMembers.length > 0 ? nextMembers : MOCK_MEMBERS);
      } catch {
        setMembers(MOCK_MEMBERS);
      }
    };

    fetchMembers();
  }, [storeId, visible]);

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
          {isCreateMode ? '근무 등록' : isEditMode ? '근무 수정' : '근무 정보'}
        </NText>
        {isFormMode ? (
          <Pressable style={styles.headerButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={24} color={typoColorPrimary} />
          </Pressable>
        ) : (
          <Pressable
            style={styles.headerButton}
            onPress={() => setMenuVisible((v) => !v)}
          >
            <Image
              source={require('@/src/shared/assets/more_option_btn.svg')}
              style={styles.moreOptionIcon}
              contentFit="contain"
            />
          </Pressable>
        )}
      </View>

      {menuVisible && !isCreateMode && (
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              setIsEditMode(true);
            }}
          >
            <NText variant="r12" style={styles.menuText}>
              수정하기
            </NText>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              setDeleteConfirmVisible(true);
            }}
          >
            <NText variant="r12" style={styles.menuText}>
              삭제하기
            </NText>
          </Pressable>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <NText variant="sb14" style={styles.sectionTitle}>
          근무자 정보
        </NText>

        <View style={styles.infoCard}>
          <InfoRow
            label="근무자"
            value={memberName}
            isPlaceholder={isEditMode}
            onPress={
              isFormMode ? () => setMemberPickerVisible(true) : undefined
            }
          />
          <InfoRow
            label="포지션"
            value={positionName}
            isPlaceholder={isEditMode || positionName === '지정안됨'}
            onPress={
              isFormMode ? () => setPositionPickerVisible(true) : undefined
            }
          />
        </View>

        <View style={styles.section}>
          <NText variant="sb14" style={styles.sectionTitle}>
            날짜
          </NText>
          <TitleButton
            title={displayDate ? formatDate(displayDate) : 'YYYY.MM.DD'}
            isPlaceholder={isEditMode || !displayDate}
            showIcon={false}
            textStyle={[
              styles.dateValue,
              (isEditMode || !displayDate) && styles.placeholderValue,
            ]}
            onPress={() => {
              if (isFormMode) {
                setDatePickerVisible(true);
              }
            }}
          />
        </View>

        <View style={styles.section}>
          <NText variant="sb14" style={styles.sectionTitle}>
            시간
          </NText>
          <View style={styles.timeRow}>
            <View style={styles.timeColumn}>
              <NText variant="m14" style={styles.timeLabel}>
                시작
              </NText>
              <TitleButton
                title={startTime ? startTime : '00:00'}
                isPlaceholder={isEditMode || !startTime}
                showIcon={false}
                onPress={() => {
                  if (isFormMode) {
                    setTimePickerTarget('start');
                  }
                }}
              />
            </View>
            <View style={styles.timeColumn}>
              <NText variant="m14" style={styles.timeLabel}>
                종료
              </NText>
              <TitleButton
                title={endTime ? endTime : '00:00'}
                isPlaceholder={isEditMode || !endTime}
                showIcon={false}
                onPress={() => {
                  if (isFormMode) {
                    setTimePickerTarget('end');
                  }
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <NText variant="sb14" style={styles.sectionTitle}>
            메모
          </NText>
          <TextInput
            value={memo}
            multiline
            placeholder="전달사항 및 특이사항을 입력해주세요"
            placeholderTextColor="#434343"
            onChangeText={setMemo}
            editable={isFormMode}
            style={[
              styles.input,
              styles.memoInput,
              isEditMode && styles.placeholderValue,
            ]}
          />
        </View>
      </ScrollView>

      <MemberPickerBottomSheet
        visible={memberPickerVisible}
        members={members}
        selectedMemberId={selectedMemberId}
        onClose={() => setMemberPickerVisible(false)}
        onSelect={(member) => {
          setSelectedMember(member);
          setMemberPickerVisible(false);
        }}
      />
      <PositionPickerBottomSheet
        visible={positionPickerVisible}
        positions={positions}
        selectedPositionId={selectedPositionId}
        onClose={() => setPositionPickerVisible(false)}
        onSelect={(position) => {
          setSelectedPosition(position);
          setPositionCleared(position === null);
          setPositionPickerVisible(false);
        }}
      />
      <ScheduleDatePickerBottomSheet
        visible={datePickerVisible}
        value={parseBirthDate(displayDate)}
        onClose={() => setDatePickerVisible(false)}
        onChange={(nextDate) => setSelectedDate(formatBirthDate(nextDate))}
      />
      <ScheduleTimePickerBottomSheet
        visible={!!timePickerTarget}
        value={timePickerTarget === 'end' ? endTime : startTime}
        minMinutes={
          timePickerTarget === 'end' && startTime
            ? Math.min(toTimeMinutes(startTime) + 60, 23 * 60 + 59)
            : 0
        }
        maxMinutes={timePickerTarget === 'start' ? 22 * 60 + 59 : 23 * 60 + 59}
        onClose={() => setTimePickerTarget(null)}
        onChange={(nextTime) => {
          if (timePickerTarget === 'end') {
            setEndTime(nextTime);
            return;
          }

          setStartTime(nextTime);
          const nextEndTime = toTimeString(toTimeMinutes(nextTime) + 60);

          if (
            !endTime ||
            toTimeMinutes(endTime) < toTimeMinutes(nextTime) + 60
          ) {
            setEndTime(nextEndTime);
          }
        }}
      />
      <BaseModal
        visible={saveConfirmVisible}
        onClose={() => setSaveConfirmVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>
            {isCreateMode
              ? '일하는 날을 추가할까요?'
              : '일하는 날을 수정할까요?'}
          </BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setSaveConfirmVisible(false)}
          >
            아니요
          </BaseModal.Button>
          <BaseModal.Button
            onPress={isCreateMode ? handleCreateSchedule : handleUpdateSchedule}
          >
            {saving
              ? isCreateMode
                ? '추가중'
                : '수정중'
              : isCreateMode
                ? '추가하기'
                : '수정하기'}
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
      <BaseModal
        visible={exitConfirmVisible}
        onClose={() => setExitConfirmVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>
            {isEditMode
              ? '수정사항을 저장하지 않고 나갈까요?'
              : '저장하지 않고 나갈까요?'}
          </BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setExitConfirmVisible(false)}
          >
            아니요
          </BaseModal.Button>
          <BaseModal.Button
            onPress={() => {
              if (isEditMode) {
                discardEditChanges();
                return;
              }

              setExitConfirmVisible(false);
              onClose();
            }}
          >
            나가기
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
          <BaseModal.Title>{failedTitle}</BaseModal.Title>
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
      <BaseModal
        visible={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>일하는 날을 삭제할까요?</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setDeleteConfirmVisible(false)}
          >
            아니요
          </BaseModal.Button>
          <BaseModal.Button onPress={handleDeleteSchedule}>
            {deleting ? '삭제중' : '삭제하기'}
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </BottomSheet>
  );
}

function formatDate(date: string) {
  return date.split('-').join('.');
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function toTimeMinutes(value: string) {
  const { hour, minute } = parseTime(value);
  return hour * 60 + minute;
}

function toTimeString(totalMinutes: number) {
  const clampedMinutes = Math.min(Math.max(totalMinutes, 0), 23 * 60 + 59);
  const hour = Math.floor(clampedMinutes / 60);
  const minute = clampedMinutes % 60;

  return formatTime(hour, minute);
}

function InfoRow({
  label,
  value,
  isPlaceholder = false,
  onPress,
}: {
  label: string;
  value: string;
  isPlaceholder?: boolean;
  onPress?: () => void;
}) {
  const RowComponent = onPress ? Pressable : View;

  return (
    <RowComponent style={styles.infoRow} onPress={onPress}>
      <NText variant="m14" style={styles.infoLabel}>
        {label}
      </NText>
      <NText
        variant="r14"
        style={[
          styles.infoValue,
          (isPlaceholder || value === '지정안됨') && styles.placeholderValue,
        ]}
      >
        {value}
      </NText>
    </RowComponent>
  );
}

function PositionPickerBottomSheet({
  visible,
  positions,
  selectedPositionId,
  onClose,
  onSelect,
}: {
  visible: boolean;
  positions: SchedulePosition[];
  selectedPositionId: string | null;
  onClose: () => void;
  onSelect: (position: SchedulePosition | null) => void;
}) {
  const selectablePositions = [
    ...positions,
    {
      id: 'none',
      name: '지정안함',
      color: '#8D8D8D',
    },
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      backdropVariant="light"
      style={styles.pickerSheet}
    >
      <NText variant="b16" style={styles.pickerTitle}>
        포지션 선택
      </NText>
      <View style={styles.memberList}>
        {selectablePositions.map((position) => {
          const isNone = position.id === 'none';
          const selected = isNone
            ? selectedPositionId === null
            : position.id === selectedPositionId;

          return (
            <Pressable
              key={position.id}
              style={styles.memberRow}
              onPress={() => onSelect(isNone ? null : position)}
            >
              <View
                style={[
                  styles.positionDot,
                  { backgroundColor: position.color },
                ]}
              />
              <NText
                variant="sb14"
                style={[styles.memberText, styles.positionText]}
              >
                {position.name}
              </NText>
              {selected && (
                <Ionicons name="checkmark" size={22} color={typoColorPrimary} />
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

function MemberPickerBottomSheet({
  visible,
  members,
  selectedMemberId,
  onClose,
  onSelect,
}: {
  visible: boolean;
  members: ScheduleMember[];
  selectedMemberId: string | null;
  onClose: () => void;
  onSelect: (member: ScheduleMember) => void;
}) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      backdropVariant="light"
      style={styles.pickerSheet}
    >
      <NText variant="b16" style={styles.pickerTitle}>
        근무자
      </NText>
      <View style={styles.memberList}>
        {members.map((member) => {
          const selected = member.id === selectedMemberId;

          return (
            <Pressable
              key={member.id}
              style={styles.memberRow}
              onPress={() => onSelect(member)}
            >
              <NText variant="r14" style={styles.memberText}>
                <NText variant="sb14" style={styles.memberName}>
                  {member.name}
                </NText>
                {member.roleName ? ` · ${member.roleName}` : ''}
              </NText>
              {selected && (
                <Ionicons name="checkmark" size={22} color={typoColorPrimary} />
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

function getDefaultDateValue(): BirthDateValue {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function ScheduleDatePickerBottomSheet({
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
      backdropVariant="light"
      style={styles.wheelSheet}
    >
      <View style={styles.wheelRow}>
        <View pointerEvents="none" style={styles.wheelSelectionHighlight} />
        <DateWheelColumn
          items={years}
          selectedValue={draft.year}
          formatLabel={(year) => `${year}`}
          unit="년"
          unitOffset={26}
          onChange={(year) => updateDraft({ year })}
        />
        <DateWheelColumn
          items={months}
          selectedValue={draft.month}
          formatLabel={(month) => `${month}`}
          unit="월"
          onChange={(month) => updateDraft({ month })}
        />
        <DateWheelColumn
          items={days}
          selectedValue={draft.day}
          formatLabel={(day) => String(day).padStart(2, '0')}
          unit="일"
          onChange={(day) => updateDraft({ day })}
        />
      </View>
      <ConfirmButton
        onPress={() => {
          onChange(draft);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

function parseTime(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return { hour: 0, minute: 0 };
  }

  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
  };
}

function ScheduleTimePickerBottomSheet({
  visible,
  value,
  minMinutes,
  maxMinutes,
  onClose,
  onChange,
}: {
  visible: boolean;
  value: string;
  minMinutes?: number;
  maxMinutes?: number;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(parseTime(value));
  const resolvedMinMinutes = minMinutes ?? 0;
  const resolvedMaxMinutes = maxMinutes ?? 23 * 60 + 59;
  const minHour = Math.floor(resolvedMinMinutes / 60);
  const maxHour = Math.floor(resolvedMaxMinutes / 60);
  const hours = createNumberRange(minHour, maxHour);
  const selectedTotalMinutes = draft.hour * 60 + draft.minute;
  const clampedTotalMinutes = Math.min(
    Math.max(selectedTotalMinutes, resolvedMinMinutes),
    resolvedMaxMinutes,
  );
  const normalizedHour = Math.floor(clampedTotalMinutes / 60);
  const normalizedMinute = clampedTotalMinutes % 60;
  const minuteStart = normalizedHour === minHour ? resolvedMinMinutes % 60 : 0;
  const minuteEnd = normalizedHour === maxHour ? resolvedMaxMinutes % 60 : 59;
  const minutes = createNumberRange(minuteStart, minuteEnd);

  useEffect(() => {
    if (visible) {
      const totalMinutes = toTimeMinutes(value);
      const nextMinutes = Math.min(
        Math.max(totalMinutes, resolvedMinMinutes),
        resolvedMaxMinutes,
      );

      setDraft({
        hour: Math.floor(nextMinutes / 60),
        minute: nextMinutes % 60,
      });
    }
  }, [resolvedMaxMinutes, resolvedMinMinutes, value, visible]);

  useEffect(() => {
    if (draft.hour !== normalizedHour || draft.minute !== normalizedMinute) {
      setDraft({
        hour: normalizedHour,
        minute: normalizedMinute,
      });
    }
  }, [draft.hour, draft.minute, normalizedHour, normalizedMinute]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      backdropVariant="light"
      style={styles.wheelSheet}
    >
      <View style={styles.wheelRow}>
        <View pointerEvents="none" style={styles.wheelSelectionHighlight} />
        <DateWheelColumn
          items={hours}
          selectedValue={normalizedHour}
          formatLabel={(hour) => `${hour}`}
          unit="시"
          onChange={(hour) =>
            setDraft((prev) => ({
              ...prev,
              hour,
            }))
          }
        />
        <DateWheelColumn
          items={minutes}
          selectedValue={normalizedMinute}
          formatLabel={(minute) => String(minute).padStart(2, '0')}
          unit="분"
          onChange={(minute) =>
            setDraft((prev) => ({
              ...prev,
              minute,
            }))
          }
        />
      </View>
      <ConfirmButton
        onPress={() => {
          onChange(formatTime(normalizedHour, normalizedMinute));
          onClose();
        }}
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
    height: 720,
    minHeight: 720,
    maxHeight: 720,
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
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
  },
  moreOptionIcon: {
    width: 24,
    height: 24,
  },
  menu: {
    position: 'absolute',
    zIndex: 20,
    top: 58,
    right: 16,
    width: 140,
    borderRadius: tokens.radiusRadius12,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing8,
    paddingVertical: 0,
    shadowColor: tokens.basicColorBlackBase,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  menuItem: {
    height: 40,
    justifyContent: 'center',
  },
  menuText: {
    color: tokens.typoColorSecondary,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  content: {
    paddingBottom: tokens.spacingSpacing20,
  },
  sectionTitle: {
    color: typoColorPrimary,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
    marginBottom: tokens.spacingSpacing10,
  },
  infoCard: {
    borderRadius: tokens.radiusRadius8,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing10,
    paddingVertical: 4,
    marginBottom: tokens.spacingSpacing20,
  },
  infoRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#333333',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  infoValue: {
    color: '#434343',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
    textAlign: 'right',
  },
  placeholderValue: {
    color: typoColorSub2,
  },
  section: {
    marginBottom: tokens.spacingSpacing20,
  },
  input: {
    height: 44,
    borderRadius: tokens.radiusRadius8,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing12,
    color: typoColorPrimary,
    fontSize: tokens.typographyPrimitiveFontSize12,
  },
  memoInput: {
    width: '100%',
    height: 80,
    paddingHorizontal: tokens.spacingSpacing10,
    paddingVertical: tokens.spacingSpacing10,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: tokens.typographyPrimitiveFontSize14,
    lineHeight: tokens.typographyPrimitiveLineHeight24,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
    includeFontPadding: false,
    textAlignVertical: 'top',
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
    color: '#333333',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  dateValue: {
    color: '#434343',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  pickerSheet: {
    minHeight: 520,
    paddingHorizontal: 0,
    paddingTop: tokens.spacingSpacing8,
  },
  pickerTitle: {
    color: '#333333',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
    marginLeft: tokens.spacingSpacing16,
    marginTop: 26,
    marginBottom: tokens.spacingSpacing30,
  },
  memberList: {
    gap: tokens.spacingSpacing10,
    marginHorizontal: tokens.spacingSpacing16,
  },
  memberRow: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radiusRadius12,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing10,
  },
  memberText: {
    flex: 1,
    color: '#575757',
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: tokens.typographyPrimitiveFontSize14,
    lineHeight: tokens.typographyPrimitiveLineHeight16,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
  },
  memberName: {
    color: '#333333',
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
  },
  positionText: {
    color: '#333333',
    fontWeight: '600',
  },
  positionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: tokens.spacingSpacing10,
  },
  wheelSheet: {
    paddingHorizontal: tokens.spacingSpacing16,
    paddingTop: tokens.spacingSpacing12,
  },
  wheelRow: {
    position: 'relative',
    flexDirection: 'row',
    gap: spacingSpacing20,
    marginBottom: spacingSpacing20,
  },
  wheelSelectionHighlight: {
    position: 'absolute',
    top: 91,
    left: 0,
    right: 0,
    height: 38,
    borderRadius: tokens.radiusRadius12,
    backgroundColor: '#E7EBF2',
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
