import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  EditableMemberRole,
  getMemberRoleLabel,
  MemberRole as MemberRoleType,
  MemberRoleLabel,
} from '@/src/entities/member/member';
import useUser from '@/src/features/user/lib/useUser';
import {
  backgroundColorWhite,
  radiusRadius8,
  spacingSpacing8,
  spacingSpacing10,
  spacingSpacing12,
  spacingSpacing20,
  spacingSpaicng14,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

import InputLabel from '../shared/InputLabel';
import MemberRole from './MemberRoleWidget';
import TitleButton from './TitleButton';

type PermissionChangeHandler = (id: string) => (value: boolean) => void;
type MemberInfoValue = {
  name: string;
  nickname: string;
  email: string;
  role?: MemberRoleType;
  memo: string | null;
  startDate: string;
  endDate: string | null;
};
type MemberInfoActions = {
  onChangeRole: (role: EditableMemberRole) => void;
  onChangeNickname: (nickname: string) => void;
  onChangeMemo: (t: string) => void;
  onChangeStartDate: () => void;
  onChangeEndDate: () => void;
};
type MemberPermissions = {
  canEditMemberInfo: boolean;
  canEditSchedule: boolean;
  canManageNotice: boolean;
  onChangePermission: PermissionChangeHandler;
};

interface MemberInfoWidgetBaseProps {
  editable?: boolean;
  member: MemberInfoValue;
  actions: MemberInfoActions;
  permissions: Partial<MemberPermissions>;
}

export default function MemberInfoWidget({
  editable = false,
  member,
  permissions,
  actions,
}: MemberInfoWidgetBaseProps) {
  const currentStoreRole = useUser((state) => state.currentStoreRole);
  const [isRoleMenuVisible, setIsRoleMenuVisible] = useState(false);
  const { name, nickname, email, role, memo, startDate, endDate } = member;
  const hasNickname = nickname.trim().length > 0;
  const hasEmail = email.trim().length > 0;
  const hasEndDate = !!endDate?.trim();
  const hasMemo = !!memo?.trim();
  const {
    onChangeMemo,
    onChangeNickname,
    onChangeRole,
    onChangeEndDate,
    onChangeStartDate,
  } = actions;
  const handlePressRole = () => {
    if (!editable) {
      return;
    }
    setIsRoleMenuVisible((prev) => !prev);
  };

  const handleSelectRole = (nextRole: EditableMemberRole) => () => {
    onChangeRole(nextRole);
    setIsRoleMenuVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.full}>
          <InputLabel label="이름" />
          <TitleButton title={name} onPress={() => {}} showIcon={false} />
        </View>
        <View style={[styles.full, styles.roleContainer]}>
          <InputLabel label="직급" />
          <TitleButton
            title={role ? getMemberRoleLabel(role) : ''}
            onPress={handlePressRole}
            showIcon={editable}
          />
          {editable && isRoleMenuVisible && (
            <View style={styles.roleMenu}>
              <Pressable
                style={styles.roleOption}
                onPress={handleSelectRole(MemberRoleType.STAFF)}
              >
                <NText
                  variant="m14"
                  style={{
                    color:
                      role === MemberRoleType.STAFF
                        ? typoColorPrimary
                        : typoColorSub1,
                  }}
                >
                  {MemberRoleLabel.STAFF}
                </NText>
              </Pressable>
              <Pressable
                style={styles.roleOption}
                onPress={handleSelectRole(MemberRoleType.MANAGER)}
              >
                <NText
                  variant="m14"
                  style={{
                    color:
                      role === MemberRoleType.MANAGER
                        ? typoColorPrimary
                        : typoColorSub1,
                  }}
                >
                  {MemberRoleLabel.MANAGER}
                </NText>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <View>
        <InputLabel label="닉네임" />
        {editable ? (
          <Input
            variant=""
            value={nickname}
            onChangeText={onChangeNickname}
            placeholder={name}
          />
        ) : (
          <TitleButton
            title={hasNickname ? nickname : name}
            onPress={() => {}}
            showIcon={false}
            isPlaceholder={!hasNickname}
          />
        )}
      </View>
      <View>
        <InputLabel label="이메일" />
        <TitleButton
          title={hasEmail ? email : '미지정'}
          onPress={() => {}}
          showIcon={false}
          isPlaceholder={!hasEmail}
        />
      </View>
      {role === MemberRoleType.MANAGER && (
        <MemberRole
          disabled={!editable || currentStoreRole !== MemberRoleType.OWNER}
          canEditMemberInfo={!!permissions?.canEditMemberInfo}
          canEditSchedule={!!permissions?.canEditSchedule}
          canManageNotice={!!permissions?.canManageNotice}
          onChangeValue={permissions?.onChangePermission ?? (() => () => {})}
        />
      )}
      <View>
        <InputLabel label="입사일" />
        <TitleButton
          title={startDate}
          onPress={onChangeStartDate}
          showIcon={false}
        />
      </View>
      <View>
        <InputLabel label="퇴사일" />
        <TitleButton
          title={hasEndDate ? (endDate ?? '') : '미지정'}
          onPress={onChangeEndDate}
          showIcon={false}
          isPlaceholder={!hasEndDate}
        />
      </View>
      <View>
        <InputLabel label="메모" />
        <Input
          variant=""
          value={memo ?? ''}
          onChangeText={onChangeMemo}
          multiline
          placeholder="작성된 내용이 아직 없어요"
          placeholderTextColor={typoColorSub1}
          style={[
            styles.memoInput,
            { color: hasMemo ? typoColorPrimary : typoColorSub1 },
          ]}
          editable={editable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpaicng14,
    gap: spacingSpacing20,
  },
  row: {
    flexDirection: 'row',
    gap: spacingSpacing12,
  },
  full: {
    flex: 1,
  },
  roleContainer: {
    zIndex: 1,
  },

  roleMenu: {
    position: 'absolute',
    top: 74,
    left: 0,
    right: 0,
    backgroundColor: backgroundColorWhite,
    borderRadius: radiusRadius8,
    paddingVertical: spacingSpacing8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  roleOption: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacingSpacing12,
  },
  memoInput: {
    minHeight: 130,
    textAlignVertical: 'top',
    padding: spacingSpacing10,
  },
});
