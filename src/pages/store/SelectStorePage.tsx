import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing12,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import InviteStoreCard from '@/src/widgets/store/InviteStoreCard';
import SectionHeader from '@/src/widgets/store/SectionHeader';

export default function SelectStorePage() {
  const router = useRouter();
  const { inviteId } = useLocalSearchParams<{ inviteId?: string }>();
  const insets = useSafeAreaInsets();
  return (
    <PageLayout showHeader showBackButton>
      <SectionHeader
        title="해당 매장에 참여할까요?"
        content="매장 정보를 확인하고 바로 참여할 수 있어요"
      />
      <InviteStoreCard
        startDate="0000-00-00"
        storeName="ㅇㅇㅇ"
        ownerName="ㅇㅇㅇ"
        inviterName="ㅇㅇㅇㅇㅇ"
      />
      <Pressable
        style={[
          styles.joinBtn,
          { marginBottom: insets.bottom + spacingSpacing12 },
        ]}
        onPress={() => router.push('/0')}
      >
        <NText
          variant="m16"
          style={{
            color: backgroundColorWhite,
          }}
        >
          참여하기
        </NText>
      </Pressable>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  joinBtn: {
    marginTop: 'auto',
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
