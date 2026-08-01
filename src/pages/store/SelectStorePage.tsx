import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  checkInviteCode,
  joinStoreWithInviteCode,
} from '@/src/features/invite/api/invite';
import { spacingSpacing12 } from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import CtaButton from '@/src/shared/ui/CtaButton';
import PageLayout from '@/src/shared/ui/PageLayout';
import InviteStoreCard from '@/src/widgets/store/InviteStoreCard';
import SectionHeader from '@/src/widgets/store/SectionHeader';

type TypeStoreInfo = {
  storeName: string;
  invitedBy: string;
  representativeName: string;
  openingDate: string;
};

export default function SelectStorePage() {
  const router = useRouter();
  const { inviteId } = useLocalSearchParams<{ inviteId?: string }>();
  const [isExpiredCode, setIsExpiredCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [storeInfo, setStoreInfo] = useState<TypeStoreInfo | null>(null);

  useEffect(() => {
    if (!inviteId) {
      return;
    }
    const fetch = async () => {
      try {
        const { data } = await checkInviteCode(inviteId);

        setStoreInfo(data);
      } catch (error) {
        const message = isAxiosError(error)
          ? typeof error.response?.data === 'string'
            ? error.response.data
            : (error.response?.data as { message?: string } | undefined)
                ?.message
          : error instanceof Error
            ? error.message
            : undefined;
        if (isAxiosError(error) && error.response?.status === 400) {
          setIsExpiredCode(true);
          setErrorMessage(message!);
          return;
        }
      }
    };

    fetch();
  }, [inviteId]);

  const handlePressJoin = async () => {
    if (!inviteId) {
      return;
    }
    try {
      const { data } = await joinStoreWithInviteCode(inviteId);

      const { storeId } = data;
      router.push(`/${storeId}`);
    } catch (error) {
      const message = isAxiosError(error)
        ? typeof error.response?.data === 'string'
          ? error.response.data
          : (error.response?.data as { message?: string } | undefined)?.message
        : error instanceof Error
          ? error.message
          : undefined;
      if (isAxiosError(error) && error.response?.status === 400) {
        setIsExpiredCode(true);
        setErrorMessage(message!);
        return;
      }
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <PageLayout showHeader showBackButton>
      <SectionHeader
        title="해당 매장에 참여할까요?"
        content="매장 정보를 확인하고 바로 참여할 수 있어요"
      />
      <InviteStoreCard
        startDate={storeInfo?.openingDate ?? ''}
        storeName={storeInfo?.storeName ?? ''}
        ownerName={storeInfo?.representativeName ?? ''}
        inviterName={storeInfo?.invitedBy ?? ''}
      />
      <CtaButton
        style={{
          marginTop: 'auto',
          marginBottom: insets.bottom + spacingSpacing12,
        }}
        onPress={handlePressJoin}
      >
        <CtaButton.Text>참여하기</CtaButton.Text>
      </CtaButton>

      <BaseModal
        visible={isExpiredCode}
        onClose={() => setIsExpiredCode(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>
            {errorMessage ?? '인증에 실패했습니다'}
          </BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button fullWidth onPress={() => setIsExpiredCode(false)}>
            확인
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
