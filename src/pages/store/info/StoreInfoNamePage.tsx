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
export default function StoreInfoNamePage() {
  const router = useRouter();
  const access = useCurrentStoreAccess();
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

  if (!canEditStoreInfo(access)) {
    return (
      <AccessDenied
        title="매장명을 수정할 수 없어요"
        message="오너 권한이 있어야 매장명을 수정할 수 있어요"
      />
    );
  }

  return (
    <PageLayout
      showBackButton
      showHeader
      icon={<CheckIcon size={20} color={typoColorPrimary} />}
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
          <BaseModal.Text>매장명을 수정할까요?</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={handleCloseConfirmModal}
          >
            아니요
          </BaseModal.Button>
          <BaseModal.Button onPress={handlePressEditButton}>
            수정하기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
