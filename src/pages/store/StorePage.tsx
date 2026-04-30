import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { deleteUser } from '@/src/features/auth/api/sign';
import DeleteAccountModal from '@/src/features/auth/ui/DeleteAccountModal';
import useUser from '@/src/features/user/lib/useUser';
import { spacingSpacing12, typoColorRed } from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

export default function StorePage() {
  const router = useRouter();
  const user = useUser();
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);

  const handleLogout = () => {
    const { clearUser } = user;
    clearUser();
    router.replace('/');
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser();

      const { clearUser } = user;
      clearUser();

      router.replace('/');
    } catch (error) {
    } finally {
      setIsDeleteAccountModalVisible(false);
    }
  };

  const insets = useSafeAreaInsets();

  //계정 삭제 버튼 관련 스타일은 추후 해당 페이지로 옮기면서 별도 스타일로 분리할 예정
  //이때, View 스타일의 flex : 1 또한 같이 옮겨야 함!
  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={() => router.push('/0')}>
        <Text>go to store</Text>
      </Pressable>
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
    </View>
  );
}
