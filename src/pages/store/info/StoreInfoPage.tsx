import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  canEditStoreInfo,
} from '@/src/features/permission/lib/access';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import { deleteStore, getStore } from '@/src/features/store/api/store';
import { spacingSpacing12, typoColorRed } from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import StoreInfoWidget from '@/src/widgets/store/StoreInfoWidget';
/**
 *
 * 접근 권한: 오너, 매니저
 *
 * 편집 권한: 오너
 */
export default function StoreInfoPage() {
  const router = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const access = useCurrentStoreAccess();

  const [storeName, setStoreName] = useState('');
  const [storeNumber, setStoreNumber] = useState<string | null>(null);
  const [representativeName, setRepresenNativeName] = useState('');
  const [deleteModalStep, setDeleteModalStep] = useState<
    'none' | 'first' | 'second'
  >('none');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getStore(storeId);

        // {"businessName": "테스트 상호명", "id": "7fbe8031-6a53-4320-a541-5d9eff7363ce", "phone": null, "storeName": "테스트 매장명"}
        setStoreName(data.storeName);
        setStoreNumber(data.phone);
        setRepresenNativeName(data.businessName);
      } catch {}
    };
    fetch();
  }, [storeId]);

  const handleDeleteStore = async () => {
    try {
      await deleteStore(storeId);
      router.replace('/');
    } catch {
    } finally {
      setDeleteModalStep('none');
    }
  };

  const handlePressStoreName = () => {
    if (!canEditStoreInfo(access)) {
      return;
    }

    router.push({
      pathname: `/store/[storeId]/info/name`,
      params: { storeId, storeName, storeNumber },
    });
  };

  const handlePressStoreNumber = () => {
    if (!canEditStoreInfo(access)) {
      return;
    }

    router.push({
      pathname: `/store/[storeId]/info/number`,
      params: { storeId, storeNumber, storeName },
    });
  };

  const insets = useSafeAreaInsets();

  return (
    <PageLayout showBackButton showHeader title="매장정보">
      <StoreInfoWidget
        storeName={storeName}
        storeNumber={storeNumber ?? ''}
        representativeName={representativeName}
        onPressStoreName={handlePressStoreName}
        onPressStoreNumber={handlePressStoreNumber}
      />
      {canEditStoreInfo(access) && (
        <Pressable
          onPress={() => setDeleteModalStep('first')}
          style={{ marginTop: 'auto' }}
        >
          <NText
            variant="sb14"
            style={{
              color: typoColorRed,
              marginBottom: spacingSpacing12 + insets.bottom,
              textAlign: 'center',
            }}
          >
            매장 삭제
          </NText>
        </Pressable>
      )}
      <BaseModal
        visible={canEditStoreInfo(access) && deleteModalStep === 'first'}
        onClose={() => setDeleteModalStep('none')}
      >
        <BaseModal.Content>
          <BaseModal.Title>매장을 삭제할까요?</BaseModal.Title>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setDeleteModalStep('none')}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button onPress={() => setDeleteModalStep('second')}>
            삭제하기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
      <BaseModal
        visible={canEditStoreInfo(access) && deleteModalStep === 'second'}
        onClose={() => setDeleteModalStep('none')}
      >
        <BaseModal.Content>
          <BaseModal.Title>매장을 삭제할까요?</BaseModal.Title>
          <BaseModal.Text>삭제하면 다시 되돌릴 수 없어요</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            variant="secondary"
            onPress={() => setDeleteModalStep('none')}
          >
            취소
          </BaseModal.Button>
          <BaseModal.Button onPress={handleDeleteStore}>
            삭제하기
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
