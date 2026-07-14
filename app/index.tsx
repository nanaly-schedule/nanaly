import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { getMyStore } from '@/src/features/store/api/store';
import SignInPage from '@/src/pages/auth/SignInPage';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      const { data: myStores } = await getMyStore();
      if (myStores[0]) {
        const [{ permissions, storeId, role, storeName }] = myStores;
        router.replace({
          pathname: '/[storeId]',
          params: {
            storeId,
            role,
            permissions,
            displayStoreName: storeName,
          },
        });
      } else {
        router.replace('/store');
      }
    };

    fetch();
  }, [router]);
  return <SignInPage />;
}
