import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStore } from '@/src/features/store/api/create';
import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing12,
  spacingSpacing24,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import InputLabel from '@/src/widgets/shared/InputLabel';
import SectionHeader from '@/src/widgets/store/SectionHeader';
import Stepper from '@/src/widgets/store/Stepper';

export default function BusinessStep3Page() {
  const router = useRouter();
  const {
    businessRegistrationNumber,
    representativeName,
    openingDate,
    businessName,
  } = useLocalSearchParams<{
    businessRegistrationNumber: string;
    representativeName: string;
    openingDate: string;
    businessName: string;
  }>();

  const [storeName, setStoreName] = useState('');
  const [
    isDuplicateBusinessNumberModalVisible,
    setIsDuplicateBusinessNumberModalVisible,
  ] = useState(false);

  const handleChangeStoreName = (t: string) => {
    setStoreName(t);
  };

  const insets = useSafeAreaInsets();
  const handlePressNextButton = async () => {
    const nextStoreName = storeName.trim() || businessName;

    if (!storeName.trim()) {
      setStoreName(businessName);
    }
    try {
      if (__DEV__) {
        const { data } = await createStore({
          businessName: '테스트 상호명',
          businessRegistrationNumber: '1231231230',
          representativeName: '나날이',
          openingDate: '2020-01-01',
          storeName: '테스트 매장명',
        });

        if (data?.storeId) {
          router.replace(`/${data.storeId}`);
        }

        return;
      }

      const { data } = await createStore({
        businessName,
        businessRegistrationNumber,
        representativeName,
        openingDate,
        storeName: nextStoreName,
      });

      if (data?.storeId) {
        router.replace(`/${data?.storeId}`);
      }
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? typeof error.response?.data === 'string'
          ? error.response.data
          : (error.response?.data as { message?: string } | undefined)?.message
        : error instanceof Error
          ? error.message
          : undefined;
      if (isAxiosError(error) && error.response?.status === 400) {
        setIsDuplicateBusinessNumberModalVisible(true);
        return;
      }

      console.log(errorMessage);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <PageLayout>
        <View
          style={{
            marginTop: spacingSpaicng14,
          }}
        >
          <Stepper currentStep={3} steps={3} />
          <SectionHeader
            title="매장 정보 설정"
            content="앱에서 사용할 매장 이름을 입력해 주세요"
            style={{ marginTop: spacingSpacing24 }}
          />
          <InputLabel label="상호명" />
          <Input
            variant=""
            placeholder={businessName}
            value={storeName}
            onChangeText={handleChangeStoreName}
          />
        </View>
        <View style={{ margin: 'auto' }} />
        <Pressable
          style={[
            styles.createBtn,
            { marginBottom: insets.bottom + spacingSpacing12 },
          ]}
          onPress={handlePressNextButton}
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
        <BaseModal
          visible={isDuplicateBusinessNumberModalVisible}
          onClose={() => setIsDuplicateBusinessNumberModalVisible(false)}
        >
          <BaseModal.Content>
            <BaseModal.Text>이미 등록된 사업자번호입니다</BaseModal.Text>
          </BaseModal.Content>
          <BaseModal.Actions>
            <BaseModal.Button
              fullWidth
              onPress={() => setIsDuplicateBusinessNumberModalVisible(false)}
            >
              확인
            </BaseModal.Button>
          </BaseModal.Actions>
        </BaseModal>
      </PageLayout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  createBtn: {
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
