import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  radiusRadius12,
  spacingSpacing8,
  spacingSpacing30,
  spacingSpaicng14,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import Toggle from '@/src/shared/ui/Toggle';

export default function AlarmSettingPage() {
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(true);
  const [isNoticeEnabled, setIsNoticeEnabled] = useState(true);
  const [isScheduleChangeEnabled, setIsScheduleChangeEnabled] = useState(true);
  const [isWorkReminderEnabled, setIsWorkReminderEnabled] = useState(true);

  const isChildToggleDisabled = !isAlarmEnabled;

  return (
    <PageLayout title="알림 설정">
      <View style={[styles.card, { marginTop: spacingSpaicng14 }]}>
        <View style={styles.row}>
          <NText variant="m14" style={styles.label}>
            알림
          </NText>
          <Toggle value={isAlarmEnabled} onValueChange={setIsAlarmEnabled} />
        </View>
      </View>
      <View style={[styles.card, { marginTop: spacingSpacing30 }]}>
        <View style={styles.card}>
          <View style={styles.row}>
            <NText variant="m14" style={styles.label}>
              공지 등록
            </NText>
            <Toggle
              value={!isChildToggleDisabled && isNoticeEnabled}
              disabled={isChildToggleDisabled}
              onValueChange={setIsNoticeEnabled}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.row}>
            <NText variant="m14" style={styles.label}>
              스케줄 변경
            </NText>
            <Toggle
              value={!isChildToggleDisabled && isScheduleChangeEnabled}
              disabled={isChildToggleDisabled}
              onValueChange={setIsScheduleChangeEnabled}
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.row}>
            <NText variant="m14" style={styles.label}>
              근무 하루전
            </NText>
            <Toggle
              value={!isChildToggleDisabled && isWorkReminderEnabled}
              disabled={isChildToggleDisabled}
              onValueChange={setIsWorkReminderEnabled}
            />
          </View>
        </View>
      </View>
    </PageLayout>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: backgroundColorWhite,
    borderRadius: radiusRadius12,
    paddingHorizontal: spacingSpacing8,
  },
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: typoColorPrimary,
    flexShrink: 1,
  },
});
