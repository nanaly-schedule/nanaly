import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { deleteUser } from '@/src/features/auth/api/sign';
import DeleteAccountModal from '@/src/features/auth/ui/DeleteAccountModal';
import { getUserProfile } from '@/src/features/user/api/profile';
import useUser from '@/src/features/user/lib/useUser';
import {
  spacingSpacing12,
  spacingSpacing20,
  typoColorRed,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import EmailInfo from '@/src/widgets/auth/sign-up/EmailInfo';
import InputLabel from '@/src/widgets/shared/InputLabel';
import TitleButton from '@/src/widgets/store/TitleButton';

export default function ProfileInfoPage() {
  const router = useRouter();

  const user = useUser();
  const [profile, setProfile] = useState({
    name: user.name,
    birthDate: user.birthDate,
    email: user.email,
    provider: null as 'google' | 'apple' | null,
  });

  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setProfile({
          name: data.name ?? '',
          birthDate: data.birthDate ?? '',
          email: data.email ?? '',
          provider: data.socialAccounts[0]?.provider ?? null,
        });
      } catch {}
    };

    fetchProfile();
  }, []);

  const handleDeleteUser = async () => {
    try {
      await deleteUser();

      const { clearUser } = user;
      await clearUser();

      router.replace('/');
    } catch {
    } finally {
      setIsDeleteAccountModalVisible(false);
    }
  };

  const handlePressChangePassword = () => {
    router.push({
      pathname: '/(my)/password',
      params: { isSocialLogin: String(!!profile.provider) },
    });
  };

  const insets = useSafeAreaInsets();
  return (
    <PageLayout title="프로필 정보" style={styles.container}>
      <View>
        <InputLabel label="이름" />
        <TitleButton title={profile.name} onPress={() => {}} showIcon={false} />
      </View>
      <View>
        <InputLabel label="생년월일" />
        <TitleButton
          title={profile.birthDate}
          onPress={() => {}}
          showIcon={false}
        />
      </View>
      <EmailInfo provider={profile.provider} email={profile.email} />
      {!profile.provider && (
        <TitleButton
          title="비밀번호 변경"
          onPress={handlePressChangePassword}
        />
      )}
      <Pressable
        onPress={() => setIsDeleteAccountModalVisible(true)}
        style={{ marginTop: 'auto' }}
      >
        <NText
          variant="sb14"
          style={{
            color: typoColorRed,
            marginBottom: spacingSpacing12 + insets.bottom,
            textAlign: 'center',
          }}
        >
          계정 삭제
        </NText>
      </Pressable>
      <DeleteAccountModal
        visible={isDeleteAccountModalVisible}
        onClose={() => setIsDeleteAccountModalVisible(false)}
        onConfirm={handleDeleteUser}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacingSpacing20,
  },
});
