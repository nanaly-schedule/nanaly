import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing24,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import Header from '@/src/shared/ui/Header';
import VerifyButton from '@/src/widgets/shared/VerifyButton';
import BusinessInfo from '@/src/widgets/store/BusinessInfo';
import SectionHeader from '@/src/widgets/store/SectionHeader';
import Stepper from '@/src/widgets/store/Stepper';

export default function BusinessStep1Page() {
  const router = useRouter();

  const [businessNumber, setBusinessNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [startDate, setStartDate] = useState('');

  const normalizedBusinessNumber = businessNumber.replace(/\D/g, '');
  const isVerify =
    normalizedBusinessNumber.length === 10 &&
    ownerName.trim().length > 0 &&
    startDate !== '';

  const handleVerifyBusinessInfo = () => {
    router.push('/store/create/step2');
  };

  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <Header title="" />
      <View
        style={{
          paddingHorizontal: spacingSpacing16,
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
          marginHorizontal: spacingSpacing16,
        }}
      />
    </View>
  );
}
