import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  spacingSpacing12,
  spacingSpacing24,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import CtaButton from '@/src/shared/ui/CtaButton';
import PageLayout from '@/src/shared/ui/PageLayout';
import BusinessInfo from '@/src/widgets/store/BusinessInfo';
import SectionHeader from '@/src/widgets/store/SectionHeader';
import Stepper from '@/src/widgets/store/Stepper';

export default function BusinessStep2Page() {
  const router = useRouter();
  const {
    businessRegistrationNumber,
    representativeName,
    openingDate,
    businessName,
  } = useLocalSearchParams<{
    businessRegistrationNumber?: string;
    representativeName?: string;
    openingDate?: string;
    businessName?: string;
  }>();

  const [businessNumber, setBusinessNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    setBusinessNumber(businessRegistrationNumber ?? '');
    setOwnerName(representativeName ?? '');
    setStartDate(openingDate ?? '');
  }, [businessRegistrationNumber, openingDate, representativeName]);

  const insets = useSafeAreaInsets();
  return (
    <PageLayout>
      <View
        style={{
          marginTop: spacingSpaicng14,
        }}
      >
        <Stepper currentStep={2} steps={3} />
        <SectionHeader
          title="사업자 정보 확인"
          content="자동으로 조회된 정보를 확인해 주세요"
          style={{ marginTop: spacingSpacing24 }}
        />
        <BusinessInfo
          editable={false}
          businessNumber={businessNumber}
          ownerName={ownerName}
          startDate={startDate}
          onChangeBusinessNumber={() => {}}
          onChangeOwnerName={() => {}}
          onChangeStartDate={() => {}}
        />
      </View>
      <CtaButton
        style={{
          marginTop: 'auto',
          marginBottom: insets.bottom + spacingSpacing12,
        }}
        onPress={() =>
          router.push({
            pathname: '/store/create/step3',
            params: {
              businessRegistrationNumber,
              representativeName,
              openingDate,
              businessName,
            },
          })
        }
      >
        <CtaButton.Text>다음으로</CtaButton.Text>
      </CtaButton>
    </PageLayout>
  );
}
