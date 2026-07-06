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

function normalizeParam(value?: string | string[]) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  if (!nextValue || nextValue === 'undefined' || nextValue === 'null') {
    return undefined;
  }

  return nextValue;
}

export default function Layout() {
  const params = useLocalSearchParams<{
    storeId?: string | string[];
  }>();
  const storeId = normalizeParam(params.storeId);
  const setUser = useUser((state) => state.setUser);

  useEffect(() => {
    if (!storeId) {
      return;
    }

    setUser({
      currentStoreAccessLoaded: false,
      currentStoreId: storeId,
      currentStoreRole: null,
      currentStorePermissions: null,
    });

    const syncCurrentStoreAccess = async () => {
      try {
        const { data: myStores } = await getMyStore();
        const currentStore = myStores.find(
          (store: MyStoreItem) => store.storeId === String(storeId),
        );

        if (!currentStore) {
          setUser({
            currentStoreAccessLoaded: true,
            currentStoreId: storeId,
            currentStoreRole: null,
            currentStorePermissions: null,
          });
          return;
        }

        setUser({
          currentStoreAccessLoaded: true,
          currentStoreId: currentStore?.storeId ?? null,
          currentStoreRole: currentStore?.role ?? null,
          currentStorePermissions: currentStore?.permissions ?? null,
        });
      } catch {
        setUser({
          currentStoreAccessLoaded: true,
          currentStoreId: storeId,
          currentStoreRole: null,
          currentStorePermissions: null,
        });
      }
    };

    syncCurrentStoreAccess();
  }, [setUser, storeId]);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: '홈' }} />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '스케줄',
          href: storeId
            ? {
                pathname: '/[storeId]/schedule',
                params: { storeId },
              }
            : null,
        }}
      />
      <Tabs.Screen name="my" options={{ title: '마이' }} />
    </Tabs>
  );
}
