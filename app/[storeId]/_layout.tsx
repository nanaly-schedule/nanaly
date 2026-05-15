import { Tabs, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { MemberRole } from '@/src/entities/member/member';
import { UserStorePermissions } from '@/src/entities/user/user';
import { getMyStore } from '@/src/features/store/api/store';
import useUser from '@/src/features/user/lib/useUser';

type MyStoreItem = {
  storeId: string;
  role: MemberRole;
  permissions: UserStorePermissions;
};

export default function Layout() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const setUser = useUser((state) => state.setUser);

  useEffect(() => {
    if (!storeId) {
      return;
    }

    const syncCurrentStoreAccess = async () => {
      try {
        const { data: myStores } = await getMyStore();
        const currentStore = myStores.find(
          (store: MyStoreItem) => store.storeId === storeId,
        );

        setUser({
          currentStoreId: currentStore?.storeId ?? null,
          currentStoreRole: currentStore?.role ?? null,
          currentStorePermissions: currentStore?.permissions ?? null,
        });
      } catch {
        setUser({
          currentStoreId: storeId,
          currentStoreRole: null,
          currentStorePermissions: null,
        });
      }
    };

    syncCurrentStoreAccess();
  }, [setUser, storeId]);

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: '홈' }} />
      <Tabs.Screen name="schedule" options={{ title: '스케줄' }} />
      <Tabs.Screen name="my" options={{ title: '마이' }} />
    </Tabs>
  );
}
