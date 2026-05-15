import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { deleteUser } from '@/src/features/auth/api/sign';
import DeleteAccountModal from '@/src/features/auth/ui/DeleteAccountModal';
import useUser from '@/src/features/user/lib/useUser';
import { spacingSpacing12, typoColorRed } from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

export default function MyPage() {
  const router = useRouter();
  const user = useUser();

  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);

  const handleLogout = async () => {
    const { clearUser } = user;
    await clearUser();
    router.replace('/auth');
  };

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

  const insets = useSafeAreaInsets();

  return (
    <>
      <Pressable onPress={handleLogout}>
        <Text>로그아웃</Text>
      </Pressable>
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
    </>
  );
}
