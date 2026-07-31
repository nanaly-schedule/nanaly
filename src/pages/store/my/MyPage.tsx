import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import useUser from '@/src/features/user/lib/useUser';
import {
  radiusRadius12,
  spacingSpacing10,
  spacingSpacing20,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import PageLayout from '@/src/shared/ui/PageLayout';
import AppInfoSection from '@/src/widgets/store/my/AppInfoSection';
import MyInfoSection from '@/src/widgets/store/my/MyInfoSection';
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
        <MyInfoSection
          onPressProfile={() => router.push('/(my)/profile')}
        />
        <TitleButton
          title="알림 설정"
          onPress={() => router.push('/(my)/alarm-setting')}
          containerStyle={styles.standaloneItem}
        />

        <AppInfoSection
          version={require('@/app.json').expo.version}
          onPressPrivacyPolicy={() => router.push('/(my)/info')}
        />

        <TitleButton
          title="의견 남기기"
          onPress={() => router.push('/(my)/feedback')}
          containerStyle={styles.standaloneItem}
        />
        <TitleButton
          title="로그아웃"
          onPress={handleLogout}
          containerStyle={styles.standaloneItem}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacingSpaicng14,
    gap: spacingSpacing20,
  },
  standaloneItem: {
    width: '100%',
    height: 52,
    borderRadius: radiusRadius12,
    paddingHorizontal: spacingSpacing10,
  },
});
