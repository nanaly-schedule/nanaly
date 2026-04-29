import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { clearTokens, getAccessToken } from '@/src/features/auth/lib/storage';
import { getUserProfile } from '@/src/features/user/api/profile';
import useUser from '@/src/features/user/lib/useUser';

export default function Layout() {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const { setUser, clearUser } = user;

      try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
          clearUser();
          router.replace('/auth');
          return;
        }

        const { data } = await getUserProfile();

        setUser({
          isTempPassword: data.isTempPassword,
          name: data.name ?? '',
          email: data.email ?? '',
          birthDate: data.birthDate ?? '',
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        clearUser();
        router.replace('/auth');
      }
    };

    fetchUser();
  }, []);

  return <Stack screenOptions={{ headerShown: __DEV__ }} />;
}
