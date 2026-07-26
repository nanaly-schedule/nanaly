import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { canEditStoreInfo } from '@/src/features/permission/lib/access';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import { updateStore } from '@/src/features/store/api/store';
import { spacingSpaicng14, typoColorPrimary } from '@/src/init/styles/tokens';
import CheckIcon from '@/src/shared/assets/CheckIcon';
import AccessDenied from '@/src/shared/ui/AccessDenied';
import BaseModal from '@/src/shared/ui/BaseModal';
import Input from '@/src/shared/ui/Input';
import PageLayout from '@/src/shared/ui/PageLayout';

/**
 *
 * 접근 권한: 오너
 *
 * 편집 권한: 오너
 */

export default function StoreInfoNumberPage() {
  const router = useRouter();
  const access = useCurrentStoreAccess();
  const { storeId, storeName, storeNumber } = useLocalSearchParams<{
    storeId: string;
    storeName: string;
    storeNumber: string;
  }>();

  const [newStoreNumber, setNewStoreNumber] = useState(storeNumber);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleChangeNewStoreNumber = (t: string) => {
    setNewStoreNumber(t);
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalVisible(false);
  };

  const hasStoreNumber = storeNumber && storeNumber.trim() !== '';
  const actionLabel = hasStoreNumber ? '수정' : '등록';
  const title = `대표번호 ${actionLabel}`;
  const content = `대표번호를 ${actionLabel}할까요?`;
  const btnContent = `${actionLabel}하기`;

  const handlePressEditButton = async () => {
    try {
      await updateStore(storeId, {
        storeName,
        phone: newStoreNumber,
      });
      setIsConfirmModalVisible(false);
      router.back();
    } catch {}
  };

  if (!canEditStoreInfo(access)) {
    return (
      <AccessDenied
        title="대표번호를 수정할 수 없어요"
        message="오너 권한이 있어야 대표번호를 수정할 수 있어요"
      />
    );
  }

  return (
    <PageLayout
      showBackButton
      showHeader
      icon={<CheckIcon size={20} color={typoColorPrimary} />}
      title={title}
      onPressCheckIcon={handleOpenConfirmModal}
    >
      <View style={{ marginTop: spacingSpaicng14 }}>
        <Input
          variant=""
          value={newStoreNumber}
          onChangeText={handleChangeNewStoreNumber}
          keyboardType="number-pad"
          placeholder={
            !hasStoreNumber ? '매장 대표번호를 입력해 주세요' : storeNumber
          }
        />
      </View>
      <BaseModal
        visible={isConfirmModalVisible}
        onClose={handleCloseConfirmModal}
      >
        <BaseModal.Content>
          <BaseModal.Text>{content}</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={handleCloseConfirmModal}
          >
            아니요
          </BaseModal.Button>
          <BaseModal.Button onPress={handlePressEditButton}>
            {btnContent}
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
