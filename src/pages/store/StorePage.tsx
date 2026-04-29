import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

import useUser from '@/src/features/user/lib/useUser';

export default function StorePage() {
  const router = useRouter();

  const user = useUser();

  const handleLogout = () => {
    const { clearUser } = user;
    clearUser();
    router.replace('/');
  };

  return (
    <>
      <Pressable onPress={() => router.push('/0')}>
        <Text>go to store</Text>
      </Pressable>
      <Pressable onPress={handleLogout}>
        <Text>로그아웃</Text>
      </Pressable>
    </>
  );
}
