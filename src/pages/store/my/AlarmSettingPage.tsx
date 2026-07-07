import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  getNotificationSettings,
  setNotificationSettings,
} from '@/src/features/user/api/notification';
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

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const { data } = await getNotificationSettings();
        setIsAlarmEnabled(data.pushEnabled);
        setIsNoticeEnabled(data.noticePushEnabled);
        setIsScheduleChangeEnabled(data.scheduleChangePushEnabled);
        setIsWorkReminderEnabled(data.scheduleReminderPushEnabled);
      } catch {}
    };

    fetchNotificationSettings();
  }, []);

  const updateNotificationSettings = async (nextSettings: {
    pushEnabled: boolean;
    noticePushEnabled: boolean;
    scheduleChangePushEnabled: boolean;
    scheduleReminderPushEnabled: boolean;
  }) => {
    try {
      await setNotificationSettings(nextSettings);
    } catch {}
  };

  const handleChangeAlarmEnabled = (value: boolean) => {
    setIsAlarmEnabled(value);
    updateNotificationSettings({
      pushEnabled: value,
      noticePushEnabled: isNoticeEnabled,
      scheduleChangePushEnabled: isScheduleChangeEnabled,
      scheduleReminderPushEnabled: isWorkReminderEnabled,
    });
  };

  const handleChangeNoticeEnabled = (value: boolean) => {
    setIsNoticeEnabled(value);
    updateNotificationSettings({
      pushEnabled: isAlarmEnabled,
      noticePushEnabled: value,
      scheduleChangePushEnabled: isScheduleChangeEnabled,
      scheduleReminderPushEnabled: isWorkReminderEnabled,
    });
  };

  const handleChangeScheduleChangeEnabled = (value: boolean) => {
    setIsScheduleChangeEnabled(value);
    updateNotificationSettings({
      pushEnabled: isAlarmEnabled,
      noticePushEnabled: isNoticeEnabled,
      scheduleChangePushEnabled: value,
      scheduleReminderPushEnabled: isWorkReminderEnabled,
    });
  };

  const handleChangeWorkReminderEnabled = (value: boolean) => {
    setIsWorkReminderEnabled(value);
    updateNotificationSettings({
      pushEnabled: isAlarmEnabled,
      noticePushEnabled: isNoticeEnabled,
      scheduleChangePushEnabled: isScheduleChangeEnabled,
      scheduleReminderPushEnabled: value,
    });
  };

  return (
    <PageLayout title="알림 설정">
      <View style={[styles.card, { marginTop: spacingSpaicng14 }]}>
        <View style={styles.row}>
          <NText variant="m14" style={styles.label}>
            알림
          </NText>
          <Toggle
            value={isAlarmEnabled}
            onValueChange={handleChangeAlarmEnabled}
          />
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
              onValueChange={handleChangeNoticeEnabled}
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
              onValueChange={handleChangeScheduleChangeEnabled}
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
              onValueChange={handleChangeWorkReminderEnabled}
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
