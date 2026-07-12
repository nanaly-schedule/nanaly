import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import InviteLinkBottomSheet from '@/src/widgets/store/InviteLinkBottomSheet';
import SectionHeader from '@/src/widgets/store/SectionHeader';

export default function JoinStorePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isInviteLinkBottomSheetVisible, setIsInviteLinkBottomSheetVisible] =
    useState(false);
  const insets = useSafeAreaInsets();
  const inviteImageWidth = Math.max(width - spacingSpacing16 * 2, 343);
  return (
    <PageLayout title="매장 참여하기">
      <SectionHeader
        title="초대링크로 매장에 참여해 보세요"
        content="관리자에게 받은 초대링크를 열거나 입력하면 바로 참여할 수 있어요"
      />
      <Image
        source={require('../../shared/assets/invite.png')}
        style={[
          styles.inviteImage,
          {
            width: inviteImageWidth,
            height: inviteImageWidth * (282 / 343),
          },
        ]}
        resizeMode="contain"
      />
      <Pressable
        style={[
          styles.verifyBtn,
          { marginBottom: spacingSpacing12 + insets.bottom },
        ]}
        onPress={() => setIsInviteLinkBottomSheetVisible(true)}
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
      <InviteLinkBottomSheet
        visible={isInviteLinkBottomSheetVisible}
        onClose={() => setIsInviteLinkBottomSheetVisible(false)}
        onConfirm={(inviteLink) => {
          const inviteId = inviteLink.split('/').pop();

          if (!inviteId) {
            return '초대링크를 다시 확인해 주세요';
          }

          router.push(`/invite/${inviteId}`);
        }}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  inviteImage: {
    alignSelf: 'center',
  },
  verifyBtn: {
    marginTop: 'auto',
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
