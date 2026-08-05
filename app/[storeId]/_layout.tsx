import { Tabs, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { MemberRole } from '@/src/entities/member/member';
import { UserStorePermissions } from '@/src/entities/user/user';
import { getMyStore } from '@/src/features/store/api/store';
import useUser from '@/src/features/user/lib/useUser';
import {
  backgroundColorPrimary,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import HomeOffIcon from '@/src/shared/assets/HomeOffIcon';
import HomeOnIcon from '@/src/shared/assets/HomeOnIcon';
import MyOffIcon from '@/src/shared/assets/MyOffIcon';
import MyOnIcon from '@/src/shared/assets/MyOnIcon';
import ScheduleOffIcon from '@/src/shared/assets/ScheduleOffIcon';
import ScheduleOnIcon from '@/src/shared/assets/ScheduleOnIcon';

type MyStoreItem = {
  storeId: string;
  role: MemberRole;
  permissions?: UserStorePermissions | null;
};

function normalizeParam(value?: string | string[]) {
  const nextValue = Array.isArray(value) ? value[0] : value;

  if (!nextValue || nextValue === 'undefined' || nextValue === 'null') {
    return undefined;
  }

  return nextValue;
}

function hasValidStoreAccessCache(storeId: string) {
  const {
    currentStoreAccessLoaded,
    currentStoreId,
    currentStoreRole,
    currentStorePermissions,
  } = useUser.getState();

  return (
    currentStoreId === storeId &&
    currentStoreAccessLoaded &&
    currentStoreRole !== null &&
    (currentStoreRole !== MemberRole.MANAGER ||
      currentStorePermissions !== null)
  );
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

    if (hasValidStoreAccessCache(storeId)) {
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: typoColorPrimary,
        tabBarInactiveTintColor: typoColorSub1,
        tabBarLabelPosition: 'below-icon',
        tabBarIconStyle: {
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          sceneStyle: {
            backgroundColor: backgroundColorPrimary,
          },
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <HomeOnIcon size={24} color={color} />
            ) : (
              <HomeOffIcon size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '스케줄',
          sceneStyle: {
            backgroundColor: backgroundColorPrimary,
          },
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <ScheduleOnIcon size={24} color={color} />
            ) : (
              <ScheduleOffIcon size={24} color={color} />
            ),
          href: storeId
            ? {
                pathname: '/[storeId]/schedule',
                params: { storeId },
              }
            : null,
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: '마이',
          sceneStyle: {
            backgroundColor: backgroundColorPrimary,
          },
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <MyOnIcon size={24} color={color} />
            ) : (
              <MyOffIcon size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
