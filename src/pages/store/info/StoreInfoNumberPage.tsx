import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { updateStore } from '@/src/features/store/api/store';
import { spacingSpaicng14 } from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import Input from '@/src/shared/ui/Input';
import PageLayout from '@/src/shared/ui/PageLayout';

export default function StoreInfoNumberPage() {
  const router = useRouter();
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

  return (
    <PageLayout
      showBackButton
      showHeader
      showCheckIcon
      title={title}
      onPressCheckIcon={handleOpenConfirmModal}
    >
      <View style={{ marginTop: spacingSpaicng14 }}>
        <Input
          variant=""
          value={newStoreNumber}
          onChangeText={handleChangeNewStoreNumber}
          placeholder={!hasStoreNumber ? '000-0000-0000' : storeNumber}
        />
      </View>
      <BaseModal
        visible={isConfirmModalVisible}
        onClose={handleCloseConfirmModal}
      >
        <BaseModal.Content>
          <BaseModal.Title>{content}</BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={handleCloseConfirmModal}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button onPress={handlePressEditButton}>
            {btnContent}
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
