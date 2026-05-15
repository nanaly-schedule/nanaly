import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { getUserProfile } from '@/src/features/user/api/profile';
import useUser from '@/src/features/user/lib/useUser';
import { startMockServer } from '@/src/mocks/server';

if (__DEV__) {
  startMockServer();
}

export default function Layout() {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const { setUser, clearUser } = user;

      try {
        const { data } = await getUserProfile();
        const { name, email, birthDate, isTempPassword } = data;
        setUser({
          isTempPassword,
          name,
          email,
          birthDate,
          currentStoreId: null,
          currentStoreRole: null,
          currentStorePermissions: null,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        await clearUser();
        router.replace('/auth');
      }
    };

    fetchUser();
  }, [router]);

  return <Stack screenOptions={{ headerShown: __DEV__ }} />;
}
