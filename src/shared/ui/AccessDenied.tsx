import { useRouter } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  spacingSpacing12,
  spacingSpacing24,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';

import CtaButton from './CtaButton';
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
      <CtaButton
        style={{
          marginTop: 'auto',
          marginBottom: insets.bottom + spacingSpacing12,
        }}
        onPress={() => router.back()}
      >
        <CtaButton.Text>뒤로가기</CtaButton.Text>
      </CtaButton>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  img: {
    marginBottom: spacingSpacing24,
  },
});
