import * as Notifications from 'expo-notifications';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { emitNotificationReceived } from '@/src/features/push/lib/notificationEvents';
import { preparePushNotificationsAsync } from '@/src/features/push/lib/pushNotification';
import { getUserProfile } from '@/src/features/user/api/profile';
import { navigateFromNotification } from '@/src/features/user/lib/notificationNavigation';
import useUser from '@/src/features/user/lib/useUser';

void SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useUser((state) => state.setUser);
  const clearUser = useUser((state) => state.clearUser);
  const isAuthRoute = pathname.startsWith('/auth');
  const [isBootstrapLoading, setIsBootstrapLoading] = useState(!isAuthRoute);

  useEffect(() => {
    if (isAuthRoute) {
      setIsBootstrapLoading(false);
      void SplashScreen.hideAsync();
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await getUserProfile();
        const { name, email, birthDate, isTempPassword } = data;
        setUser({
          isTempPassword,
          name,
          email,
          birthDate,
        });
        await preparePushNotificationsAsync();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        await clearUser();
        router.replace('/auth');
      } finally {
        setIsBootstrapLoading(false);
        void SplashScreen.hideAsync();
      }
    };

    setIsBootstrapLoading(true);
    fetchUser();
  }, [clearUser, isAuthRoute, router, setUser]);

  useEffect(() => {
    const notificationSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        const { data } = notification.request.content;

        emitNotificationReceived({
          notificationId:
            typeof data.notificationId === 'string'
              ? data.notificationId
              : null,
          storeId: typeof data.storeId === 'string' ? data.storeId : null,
          targetId: typeof data.targetId === 'string' ? data.targetId : null,
          type: typeof data.type === 'string' ? data.type : null,
        });
      });

    const handleNotificationResponse = async (
      response: Notifications.NotificationResponse,
    ) => {
      const { data } = response.notification.request.content;

      await navigateFromNotification(router, {
        notificationId:
          typeof data.notificationId === 'string' ? data.notificationId : null,
        storeId: typeof data.storeId === 'string' ? data.storeId : null,
        targetId: typeof data.targetId === 'string' ? data.targetId : null,
        type: typeof data.type === 'string' ? data.type : null,
      });
    };

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        void handleNotificationResponse(response);
      });
    const lastNotificationResponse =
      Notifications.getLastNotificationResponse();
    if (lastNotificationResponse) {
      void handleNotificationResponse(lastNotificationResponse);
    }

    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  }, [router]);

  if (isBootstrapLoading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
