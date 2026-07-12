import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditableMemberRole, MemberRole } from '@/src/entities/member/member';
import {
  canEditMemberInfo,
} from '@/src/features/permission/lib/access';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import {
  deleteMember,
  getMember,
  updateMember,
} from '@/src/features/store/api/member';
import DatePickerBottomSheet from '@/src/features/store/ui/DatePickerBottomSheet';
import DeleteMemberModal from '@/src/features/store/ui/DeleteMemberModal';
import useUser from '@/src/features/user/lib/useUser';
import {
  spacingSpacing12,
  spacingSpacing30,
  typoColorPrimary,
  typoColorRed,
} from '@/src/init/styles/tokens';
import CheckIcon from '@/src/shared/assets/CheckIcon';
import EditIcon from '@/src/shared/assets/EditIcon';
import {
  BirthDateValue,
  formatBirthDate,
  parseBirthDate,
} from '@/src/shared/lib/date';
import AccessDenied from '@/src/shared/ui/AccessDenied';
import BaseModal from '@/src/shared/ui/BaseModal';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import MemberInfoWidget from '@/src/widgets/store/MemberInfoWidget';

type TypeUser = {
  canEditMemberInfo: boolean;
  canEditSchedule: boolean;
  canManageNotice: boolean;
  birthDate: string;
  id: string;
  joinDate: string;
  leaveDate: string | null;
  memo: string | null;
  name: string;
  role: MemberRole;
};

/**
 *
 * 접근 권한: 오너, 매니저
 *
 * 편집 권한: canEditMemberInfo
 */

export default function MemberInfoPage() {
  const route = useRouter();
  const { storeId, memberId } = useLocalSearchParams<{
    storeId: string;
    memberId: string;
  }>();
  const access = useCurrentStoreAccess();
  const currentUser = useUser();

  const [editable, setEditable] = useState(false);

  const [user, setUser] = useState<Partial<TypeUser>>({});

  const [visibleDatePicker, setVisibleDatePicker] = useState<
    'start' | 'end' | null
  >(null);

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isDateErrorModalVisible, setIsDateErrorModalVisible] = useState(false);
  const [isBackWithoutSave, setIsBackWithoutSave] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const [isDeleteMemberModalVisible, setIsDeleteMemberModalVisible] =
    useState(false);

  useEffect(() => {
    if (!storeId || !memberId) {
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await getMember(storeId, memberId);
        setUser(data);
      } catch {
        setUser({});
      }
    };
    fetch();
  }, [storeId, memberId]);

  const handlePressEditMode = () => {
    if (editable) {
      setIsConfirmModalVisible(true);
    } else if (canEditTargetMember) {
      setEditable(true);
    }
  };

  const handlePressDate = (id: 'start' | 'end') => () => {
    if (!editable) {
      return;
    }
    setVisibleDatePicker(id);
  };

  const handleChangeDate = (value: BirthDateValue) => {
    if (!editable) {
      return;
    }
    if (visibleDatePicker === 'start') {
      setUser((prev) => ({ ...prev, joinDate: formatBirthDate(value) }));
    } else if (visibleDatePicker === 'end') {
      setUser((prev) => ({ ...prev, leaveDate: formatBirthDate(value) }));
    }

    setVisibleDatePicker(null);
  };

  const handleChangeMemo = (t: string) => {
    setUser((prev) => ({ ...prev, memo: t }));
  };
  const handleChangeRole = (role: EditableMemberRole) => {
    if (!editable) {
      return;
    }
    setUser((prev) => ({ ...prev, role }));
  };

  const handleChangePermission = (id: string) => (value: boolean) => {
    if (!editable) {
      return;
    }
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const handlePressSaveButton = async () => {
    try {
      if (!user) {
        return;
      }

      if (user.joinDate && user.leaveDate && user.leaveDate <= user.joinDate) {
        setIsDateErrorModalVisible(true);
        return;
      }

      await updateMember(storeId, memberId, {
        role: user.role!,
        joinDate: user.joinDate!,
        leaveDate: user.leaveDate!,
        memo: user.memo!,
        canEditMemberInfo: user.canEditMemberInfo!,
        canEditSchedule: user.canEditSchedule!,
        canManageNotice: user.canManageNotice!,
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        setSaveErrorMessage('근무자 정보를 수정할 권한이 없어요');
        return;
      }

      if (isAxiosError(error) && error.response?.status === 404) {
        setSaveErrorMessage('근무자를 찾을 수 없어요');
        return;
      }

      setSaveErrorMessage('근무자 정보 수정 중 오류가 발생했어요');
      return;
    }
    setIsConfirmModalVisible(false);
    setEditable(false);
  };
  const handleCloseConfirmModal = () => {
    setIsConfirmModalVisible(false);
  };
  const handleDeleteMember = async () => {
    try {
      await deleteMember(storeId, memberId);
      setIsDeleteMemberModalVisible(false);
      route.back();
    } catch {
      //todo: 에러처리
    }
  };
  const handlePressBack = () => {
    if (!editable) {
      route.back();
      return;
    }
    setIsBackWithoutSave(true);
  };

  const handlePressBackButton = () => {
    setIsBackWithoutSave(false);
    route.back();
  };
  const memberInfo = {
    name: user?.name ?? '',
    memo: user?.memo ?? '',
    role: user?.role,
    birthDate: user?.birthDate ?? '',
    startDate: user?.joinDate ?? '',
    endDate: user?.leaveDate ?? '',
  };

  const memberPermissions = {
    canEditMemberInfo: !!user.canEditMemberInfo,
    canEditSchedule: !!user.canEditSchedule,
    canManageNotice: !!user.canManageNotice,
    onChangePermission: handleChangePermission,
  };

  const memberActions = {
    onChangeStartDate: handlePressDate('start'),
    onChangeEndDate: handlePressDate('end'),
    onChangeMemo: handleChangeMemo,
    onChangeRole: handleChangeRole,
  };
  const isEditingSelf =
    !!currentUser.name &&
    !!currentUser.birthDate &&
    !!user.name &&
    !!user.birthDate &&
    currentUser.name === user.name &&
    currentUser.birthDate === user.birthDate;
  const isOwnerTarget = user.role === MemberRole.OWNER;
  const canEditTargetMember =
    canEditMemberInfo(access) &&
    !isOwnerTarget &&
    !(access.role === MemberRole.MANAGER && isEditingSelf);

  const insets = useSafeAreaInsets();

  if (isOwnerTarget && !isEditingSelf) {
    return (
      <AccessDenied
        title="오너 정보에 접근할 수 없어요"
        message="오너 이상 권한이 있어야 근무자 정보를 볼 수 있어요"
      />
    );
  }
  return (
    <PageLayout
      title="근무자 정보"
      icon={
        canEditTargetMember ? (
          editable ? (
            <CheckIcon size={20} color={typoColorPrimary} />
          ) : (
            <EditIcon size={20} color={typoColorPrimary} />
          )
        ) : undefined
      }
      onPressBack={handlePressBack}
      onPressCheckIcon={handlePressEditMode}
    >
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: spacingSpacing30 * 4 + insets.bottom,
          }}
        >
          <MemberInfoWidget
            editable={editable}
            member={memberInfo}
            permissions={memberPermissions}
            actions={memberActions}
          />
        </ScrollView>
        {canEditTargetMember && (
          <Pressable
            onPress={() => setIsDeleteMemberModalVisible(true)}
            style={{
              marginTop: 'auto',
              marginBottom: spacingSpacing12 + insets.bottom,
              paddingTop: spacingSpacing12,
            }}
          >
            <NText
              variant="sb14"
              style={{
                color: typoColorRed,
                marginBottom: insets.bottom,
                textAlign: 'center',
              }}
            >
              근무자 삭제
            </NText>
          </Pressable>
        )}
      </View>

      <DeleteMemberModal
        visible={canEditTargetMember && isDeleteMemberModalVisible}
        onClose={() => setIsDeleteMemberModalVisible(false)}
        onConfirm={handleDeleteMember}
      />

      <DatePickerBottomSheet
        visible={!!visibleDatePicker}
        value={parseBirthDate(user.leaveDate)}
        onChange={handleChangeDate}
        onClose={() => setVisibleDatePicker(null)}
      />

      <BaseModal
        visible={isConfirmModalVisible}
        onClose={handleCloseConfirmModal}
      >
        <BaseModal.Content>
          <BaseModal.Title>변경사항을 저장할까요?</BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={handleCloseConfirmModal}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button onPress={handlePressSaveButton}>
            저장하기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
      <BaseModal
        visible={isDateErrorModalVisible}
        onClose={() => setIsDateErrorModalVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Title>종료일을 다시 확인해주세요</BaseModal.Title>
          <BaseModal.Text>종료일은 시작일보다 나중이어야 해요</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button onPress={() => setIsDateErrorModalVisible(false)}>
            확인
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
      <BaseModal
        visible={!!saveErrorMessage}
        onClose={() => setSaveErrorMessage(null)}
      >
        <BaseModal.Content>
          <BaseModal.Title>저장에 실패했어요</BaseModal.Title>
          <BaseModal.Text>{saveErrorMessage}</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button onPress={() => setSaveErrorMessage(null)}>
            확인
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
      <BaseModal
        visible={isBackWithoutSave}
        onClose={() => setIsBackWithoutSave(false)}
      >
        <BaseModal.Content>
          <BaseModal.Title>저장하지 않고 나갈가요?</BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setIsBackWithoutSave(false)}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button onPress={handlePressBackButton}>
            나가기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
