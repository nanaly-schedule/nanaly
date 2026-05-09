import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { updateStore } from '@/src/features/store/api/store';
import { spacingSpaicng14 } from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import Input from '@/src/shared/ui/Input';
import PageLayout from '@/src/shared/ui/PageLayout';

export default function StoreInfoNamePage() {
  const router = useRouter();
  const { storeId, storeName, storeNumber } = useLocalSearchParams<{
    storeId: string;
    storeName: string;
    storeNumber: string;
  }>();

  const [newStoreName, setNewStoreName] = useState('');
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleChagneNewStoreName = (t: string) => {
    setNewStoreName(t);
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmModalVisible(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalVisible(false);
  };

  const handlePressEditButton = async () => {
    try {
      await updateStore(storeId, {
        storeName: newStoreName || storeName,
        phone: storeNumber,
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
      title="매장명 수정"
      onPressCheckIcon={handleOpenConfirmModal}
    >
      <View style={{ marginTop: spacingSpaicng14 }}>
        <Input
          variant=""
          value={newStoreName}
          onChangeText={handleChagneNewStoreName}
          placeholder={storeName}
        />
      </View>
      <BaseModal
        visible={isConfirmModalVisible}
        onClose={handleCloseConfirmModal}
      >
        <BaseModal.Content>
          <BaseModal.Title>매장명을 수정할까요?</BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={handleCloseConfirmModal}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button onPress={handlePressEditButton}>
            수정하기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
