import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { getMyStore } from '@/src/features/store/api/store';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: myStores } = await getMyStore();
        if (myStores[0]) {
          const [{ permissions, storeId, role, storeName }] = myStores;
          router.push({
            pathname: '/[storeId]',
            params: {
              storeId,
              role,
              permissions,
              displayStoreName: storeName,
            },
          });
        } else {
          router.push('/store');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        router.replace('/auth');
      }
    };

    fetch();
  }, [router]);
  return <View />;
}
