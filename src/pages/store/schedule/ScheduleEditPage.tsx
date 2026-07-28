import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, TextInput, View } from 'react-native';

import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import * as tokens from '@/src/init/styles/tokens';
import { buttonColorCta, typoColorPrimary } from '@/src/init/styles/tokens';
import AccessDenied from '@/src/shared/ui/AccessDenied';
import BaseModal from '@/src/shared/ui/BaseModal';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import { MOCK_SCHEDULES } from '@/src/widgets/schedule/mock';

export default function ScheduleEditPage() {
  const router = useRouter();
  const { scheduleId } = useLocalSearchParams<{ scheduleId?: string }>();
  const access = useCurrentStoreAccess();
  const isCreateMode = !scheduleId;
  const schedule =
    MOCK_SCHEDULES.find((item) => item.id === scheduleId) ??
    ({
      id: 'new',
      date: new Date().toISOString().slice(0, 10),
      memberId: 'me',
      memberName: '',
      positionId: null,
      positionName: null,
      positionColor: null,
      startTime: '',
      endTime: '',
      memo: '',
    } as const);
  const [startTime, setStartTime] = useState(schedule.startTime);
  const [endTime, setEndTime] = useState(schedule.endTime);
  const [memo, setMemo] = useState(schedule.memo ?? '');
  const [saveVisible, setSaveVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);

  const hasChanges =
    startTime !== schedule.startTime ||
    endTime !== schedule.endTime ||
    memo !== (schedule.memo ?? '');

  const handleBack = () => {
    if (hasChanges) {
      setExitVisible(true);
      return;
    }

    router.back();
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (hasChanges) {
          setExitVisible(true);
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [hasChanges]);

  if (!access.loaded) {
    return <View />;
  }

  if (!access.canEditSchedule) {
    return (
      <AccessDenied message="현재 매장 권한으로는 스케줄을 변경할 수 없어요" />
    );
  }

  return (
    <PageLayout
      title={isCreateMode ? '근무 등록' : '근무 수정'}
      icon={
        <NText variant="b16" style={styles.saveText}>
          저장
        </NText>
      }
      onPressCheckIcon={() => setSaveVisible(true)}
      onPressBack={handleBack}
    >
      <View style={styles.container}>
        <InfoInput
          label="근무자"
          value={schedule.memberName}
          editable={isCreateMode}
        />
        <InfoInput
          label="포지션"
          value={schedule.positionName ?? '선택 안함'}
          editable={isCreateMode}
        />
        <InfoInput label="날짜" value={schedule.date} editable={false} />
        <View style={styles.timeRow}>
          <InfoInput
            label="시작"
            value={startTime}
            onChangeText={setStartTime}
          />
          <InfoInput label="종료" value={endTime} onChangeText={setEndTime} />
        </View>
        <InfoInput label="메모" value={memo} onChangeText={setMemo} multiline />
      </View>

      <BaseModal visible={saveVisible} onClose={() => setSaveVisible(false)}>
        <BaseModal.Content>
          <BaseModal.Text>저장하시겠습니까?</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setSaveVisible(false)}
          >
            나가기
          </BaseModal.Button>
          <BaseModal.Button
            onPress={() => {
              setSaveVisible(false);
              router.back();
            }}
          >
            마무리
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>

      <BaseModal visible={exitVisible} onClose={() => setExitVisible(false)}>
        <BaseModal.Content>
          <BaseModal.Text>저장하지 않고 나가실까요?</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setExitVisible(false)}
          >
            나가기
          </BaseModal.Button>
          <BaseModal.Button
            onPress={() => {
              setExitVisible(false);
              router.back();
            }}
          >
            마무리
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}

function InfoInput({
  label,
  value,
  editable = true,
  multiline = false,
  onChangeText,
}: {
  label: string;
  value: string;
  editable?: boolean;
  multiline?: boolean;
  onChangeText?: (value: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <NText variant="r12" style={styles.label}>
        {label}
      </NText>
      <TextInput
        value={value}
        editable={editable}
        multiline={multiline}
        onChangeText={onChangeText}
        style={[styles.input, multiline && styles.memo]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: tokens.spacingSpacing24,
    gap: tokens.spacingSpacing16,
  },
  saveText: {
    color: buttonColorCta,
  },
  inputGroup: {
    flex: 1,
    gap: tokens.spacingSpacing8,
  },
  label: {
    color: tokens.typoColorSecondary,
  },
  input: {
    minHeight: 44,
    borderRadius: tokens.radiusRadius8,
    backgroundColor: tokens.basicColorWhiteBase,
    paddingHorizontal: tokens.spacingSpacing12,
    color: typoColorPrimary,
  },
  memo: {
    minHeight: 88,
    textAlignVertical: 'top',
    paddingTop: tokens.spacingSpacing12,
  },
  timeRow: {
    flexDirection: 'row',
    gap: tokens.spacingSpacing12,
  },
});
