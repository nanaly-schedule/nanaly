import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { getAccessToken } from '@/src/features/auth/lib/storage';
import { getMyStore } from '@/src/features/store/api/store';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
          router.replace('/auth');
          return;
        }

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
      } catch {
        router.replace('/auth');
      }
    };

    fetch();
  }, [router]);

  return null;
}
