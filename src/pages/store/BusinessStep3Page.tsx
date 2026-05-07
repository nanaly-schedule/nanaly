import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing12,
  spacingSpacing24,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import InputLabel from '@/src/widgets/shared/InputLabel';
import SectionHeader from '@/src/widgets/store/SectionHeader';
import Stepper from '@/src/widgets/store/Stepper';

export default function BusinessStep3Page() {
  const router = useRouter();

  const [initialStoreName] = useState('');
  const [storeName, setStoreName] = useState('');

  const handleChangeStoreName = (t: string) => {
    setStoreName(t);
  };

  const insets = useSafeAreaInsets();

  //! KeyboardAvoidingView에서 다음으로 버튼이 키보드보다 위로 안 올라오는 이유는 개발모드에서 헤더를 보이게 만들었기 때문입니다. 라우터 헤더를 숨기면 올라옵니다.
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
            placeholder={initialStoreName}
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
