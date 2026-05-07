import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing12,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import SectionHeader from '@/src/widgets/store/SectionHeader';

export default function JoinStorePage() {
  const insets = useSafeAreaInsets();
  return (
    <PageLayout title="매장 참여하기">
      <View
        style={{
          marginTop: spacingSpaicng14,
        }}
      >
        <SectionHeader
          title="초대링크로 매장에 참여해 보세요"
          content="관리자에게 받은 초대링크를 열거나 입력하면 바로 참여할 수 있어요"
        />
        <Image source={require('../../shared/assets/join.png')} />
      </View>
      <Pressable
        style={[
          styles.verifyBtn,
          { marginBottom: spacingSpacing12 + insets.bottom },
        ]}
        onPress={() => {}}
      >
        <NText
          variant="m16"
          style={{
            color: backgroundColorWhite,
          }}
        >
          링크 입력하기
        </NText>
      </Pressable>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  verifyBtn: {
    marginTop: 'auto',
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
