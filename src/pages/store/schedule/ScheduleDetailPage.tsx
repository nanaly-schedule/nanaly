import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import {
  typoColorPrimary,
  typoColorSecondary,
} from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import { MOCK_SCHEDULES } from '@/src/widgets/schedule/mock';

export default function ScheduleDetailPage() {
  const { storeId, scheduleId } = useLocalSearchParams<{
    storeId: string;
    scheduleId: string;
  }>();
  const access = useCurrentStoreAccess();
  const { canEditSchedule } = access;
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const schedule =
    MOCK_SCHEDULES.find((item) => item.id === scheduleId) ??
    MOCK_SCHEDULES[0];

  if (!access.loaded) {
    return <View />;
  }

  return (
    <PageLayout
      title="근무 정보"
      icon={
        canEditSchedule ? (
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={typoColorPrimary}
          />
        ) : undefined
      }
      onPressCheckIcon={
        canEditSchedule
          ? () => setMenuVisible((visible) => !visible)
          : undefined
      }
    >
      {menuVisible && canEditSchedule && (
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              router.push({
                pathname: '/[storeId]/schedule/[scheduleId]/edit',
                params: { storeId, scheduleId },
              });
            }}
          >
            <NText variant="m16" style={styles.menuText}>
              수정하기
            </NText>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuVisible(false);
              setDeleteVisible(true);
            }}
          >
            <NText variant="m16" style={styles.menuText}>
              삭제하기
            </NText>
          </Pressable>
        </View>
      )}

      <View style={styles.container}>
        <NText variant="b16" style={styles.sectionTitle}>
          근무자 정보
        </NText>
        <View style={styles.infoCard}>
          <InfoRow label="근무자" value={schedule.memberName} />
          <InfoRow label="포지션" value={schedule.positionName ?? '선택 안함'} />
        </View>
        <InfoRow label="날짜" value={schedule.date} />
        <InfoRow
          label="시간"
          value={`${schedule.startTime} - ${schedule.endTime}`}
        />
        <InfoRow label="메모" value={schedule.memo ?? '메모가 없어요'} />
      </View>

      <BaseModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Title>해당 근무를 삭제할까요?</BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setDeleteVisible(false)}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button
            onPress={() => {
              setDeleteVisible(false);
              router.back();
            }}
          >
            삭제하기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <NText variant="r12" style={styles.label}>
        {label}
      </NText>
      <NText variant="r14" style={styles.value}>
        {value}
      </NText>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    zIndex: 10,
    top: 46,
    right: 0,
    width: 150,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
  menuItem: {
    height: 68,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  menuText: {
    color: typoColorPrimary,
  },
  container: {
    paddingTop: 56,
    gap: 16,
  },
  sectionTitle: {
    color: typoColorPrimary,
  },
  infoCard: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  label: {
    color: typoColorPrimary,
  },
  value: {
    color: typoColorSecondary,
  },
});
