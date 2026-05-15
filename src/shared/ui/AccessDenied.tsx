import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorWhite,
  buttonColorCta,
  buttonColorSecondary,
  radiusRadius8,
  radiusRadius12,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing24,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';

import Main from './Main';
import NText from './NText';
import PageLayout from './PageLayout';

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

export default function AccessDenied({
  title = '접근할 수 없어요',
  message = '현재 매장 권한으로는 이 페이지를 열 수 없어요',
}: AccessDeniedProps) {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  return (
    <PageLayout showBackButton={false} title="">
      <Main>
        <Image
          source={require('../../shared/assets/warning.png')}
          style={styles.img}
        />
        <NText variant="h2" style={{ color: typoColorPrimary }}>
          {title}
        </NText>
        <NText variant="r14" style={{ color: typoColorSub1 }}>
          {message}
        </NText>
      </Main>
      <Pressable
        style={[
          styles.button,
          { marginBottom: insets.bottom + spacingSpacing12 },
        ]}
        onPress={() => router.back()}
      >
        <NText
          variant="m16"
          style={{
            color: backgroundColorWhite,
          }}
        >
          뒤로가기
        </NText>
      </Pressable>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  img: {
    marginBottom: spacingSpacing24,
  },
  button: {
    marginTop: 'auto',
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
