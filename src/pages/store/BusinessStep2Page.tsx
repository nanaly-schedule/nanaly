import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing24,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import Header from '@/src/shared/ui/Header';
import NText from '@/src/shared/ui/NText';
import BusinessInfo from '@/src/widgets/store/BusinessInfo';
import SectionHeader from '@/src/widgets/store/SectionHeader';
import Stepper from '@/src/widgets/store/Stepper';

export default function BusinessStep2Page() {
  const router = useRouter();

  const [businessNumber, setBusinessNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [startDate, setStartDate] = useState('');

  //todo: set api for store info
  useEffect(() => {
    setBusinessNumber('');
    setOwnerName('');
    setStartDate('');
  }, []);

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
      <Pressable
        style={[
          styles.nextBtn,
          { marginBottom: insets.bottom + spacingSpacing12 },
        ]}
        onPress={() => router.push('/store/create/step3')}
      >
        <NText
          variant="m16"
          style={{
            color: backgroundColorWhite,
          }}
        >
          다음으로
        </NText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  nextBtn: {
    marginTop: 'auto',
    marginHorizontal: spacingSpacing16,
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
