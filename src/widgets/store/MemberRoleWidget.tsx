import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  radiusRadius12,
  radiusRadius16,
  spacingSpacing8,
  spacingSpacing20,
  spacingSpacing24,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import Toggle from '@/src/shared/ui/Toggle';

import InputLabel from '../shared/InputLabel';

interface MemberRoleProps {
  canEditMemberInfo: boolean;
  canEditSchedule: boolean;
  canManageNotice: boolean;
  disabled: boolean;
  onChangeValue: (id: string) => (value: boolean) => void;
}

export default function MemberRole({
  canEditMemberInfo,
  canEditSchedule,
  canManageNotice,
  disabled,
  onChangeValue,
}: MemberRoleProps) {
  const permissions = [
    { id: 'canManageNotice', label: '공지 관리', value: canManageNotice },
    { id: 'canEditSchedule', label: '스케줄 변경', value: canEditSchedule },
    {
      id: 'canEditMemberInfo',
      label: '근무자 정보 수정',
      value: canEditMemberInfo,
    },
  ];
  return (
    <View>
      <InputLabel label="권한설정" />
      <View style={styles.card}>
        {permissions.map((permission) => (
          <View key={permission.label} style={styles.row}>
            <NText variant="m14" style={styles.label}>
              {permission.label}
            </NText>
            <Toggle
              value={permission.value}
              disabled={disabled}
              onValueChange={onChangeValue(permission.id)}
            />
          </View>
        ))}
      </View>
    </View>
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
