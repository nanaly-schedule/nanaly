import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { verifyBusiness } from '@/src/features/store/api/verify';
import {
  spacingSpacing12,
  spacingSpacing24,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import PageLayout from '@/src/shared/ui/PageLayout';
import VerifyButton from '@/src/widgets/shared/VerifyButton';
import BusinessInfo from '@/src/widgets/store/BusinessInfo';
import SectionHeader from '@/src/widgets/store/SectionHeader';
import Stepper from '@/src/widgets/store/Stepper';

export default function BusinessStep1Page() {
  const router = useRouter();

  const [businessNumber, setBusinessNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isVerificationErrorModalVisible, setIsVerificationErrorModalVisible] =
    useState(false);

  const normalizedBusinessNumber = businessNumber.replace(/\D/g, '');
  const isVerify =
    normalizedBusinessNumber.length === 10 &&
    ownerName.trim().length > 0 &&
    startDate !== '';

  const handleVerifyBusinessInfo = async () => {
    try {
      const { data } = await verifyBusiness({
        businessRegistrationNumber: normalizedBusinessNumber,
        representativeName: ownerName.trim(),
        openingDate: startDate,
      });

      const { businessName, openingDate, representativeName, valid } = data;
      if (valid) {
        router.push({
          pathname: '/store/create/step2',
          params: {
            businessRegistrationNumber: normalizedBusinessNumber,
            businessName,
            openingDate,
            representativeName,
          },
        });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setIsVerificationErrorModalVisible(true);
        return;
      }

      setIsVerificationErrorModalVisible(true);
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <PageLayout>
      <View
        style={{
          marginTop: spacingSpaicng14,
        }}
      >
        <Stepper currentStep={1} steps={3} />
        <SectionHeader
          title="사업자 정보 확인"
          content="매장 등록을 위해 사업장 정보를 확인해 주세요"
          style={{ marginTop: spacingSpacing24 }}
        />
        <BusinessInfo
          businessNumber={businessNumber}
          ownerName={ownerName}
          startDate={startDate}
          onChangeBusinessNumber={setBusinessNumber}
          onChangeOwnerName={setOwnerName}
          onChangeStartDate={setStartDate}
        />
      </View>
      <VerifyButton
        isVerifyDisabled={!isVerify}
        onVerify={handleVerifyBusinessInfo}
        style={{
          marginTop: 'auto',
          marginBottom: insets.bottom + spacingSpacing12,
        }}
      />
      <BaseModal
        visible={isVerificationErrorModalVisible}
        onClose={() => setIsVerificationErrorModalVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Text>
            입력한 사업자 정보를 다시 확인해 주세요
          </BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            fullWidth
            onPress={() => setIsVerificationErrorModalVisible(false)}
          >
            확인
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </PageLayout>
  );
}
