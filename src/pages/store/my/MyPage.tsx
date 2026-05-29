import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { deleteUser } from '@/src/features/auth/api/sign';
import DeleteAccountModal from '@/src/features/auth/ui/DeleteAccountModal';
import useUser from '@/src/features/user/lib/useUser';
import {
  backgroundColorWhite,
  radiusRadius8,
  radiusRadius12,
  spacingSpacing8,
  spacingSpacing10,
  spacingSpacing20,
  spacingSpaicng14,
  typoColorPrimary,
  typoColorSecondary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import TitleButton from '@/src/widgets/store/TitleButton';

export default function MyPage() {
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    const { clearUser } = user;
    await clearUser();
    router.replace('/auth');
  };

  return (
    <PageLayout title="마이" showBackButton={false}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <NText variant="m12" style={{ color: typoColorSub1 }}>
            내정보
          </NText>
          <TitleButton
            title="프로필 정보"
            onPress={() => router.push(`/(my)/profile`)}
          />
        </View>
        <TitleButton
          title="알림 설정"
          onPress={() => router.push(`/(my)/alarm-setting`)}
        />
        <View style={styles.container}>
          <NText variant="m12" style={{ color: typoColorSub1 }}>
            앱정보
          </NText>
          <TitleButton
            title="개인정보 처리방침"
            onPress={() => router.push(`/(my)/info`)}
          />
          <View style={styles.version}>
            <NText variant="m14" style={{ color: typoColorPrimary }}>
              버전
            </NText>
            <NText variant="m12" style={{ color: typoColorSecondary }}>
              v {require('@/app.json').expo.version}
            </NText>
          </View>
        </View>

        <TitleButton
          title="의견 남기기"
          onPress={() => router.push('/(my)/feedback')}
        />
        <TitleButton title="로그아웃" onPress={handleLogout} />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacingSpaicng14,
    gap: spacingSpacing20,
  },
  container: {
    backgroundColor: backgroundColorWhite,
    borderRadius: radiusRadius12,
    paddingVertical: spacingSpacing10,
    paddingHorizontal: spacingSpacing8,
    gap: spacingSpacing10,
  },
  version: {
    borderRadius: radiusRadius8,
    paddingHorizontal: spacingSpacing8,
    backgroundColor: backgroundColorWhite,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
