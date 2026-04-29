import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import useUser from '@/src/features/user/lib/useUser';

export default function Home() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user.email) {
      router.push('/auth');
    } else {
      router.replace('/store');
    }
  }, []);

  return <View />;
}
