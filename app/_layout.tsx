import * as Notifications from 'expo-notifications';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { emitNotificationReceived } from '@/src/features/push/lib/notificationEvents';
import { preparePushNotificationsAsync } from '@/src/features/push/lib/pushNotification';
import { getUserProfile } from '@/src/features/user/api/profile';
import { navigateFromNotification } from '@/src/features/user/lib/notificationNavigation';
import useUser from '@/src/features/user/lib/useUser';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://4736cb4b21a4558e9c37ae865e5e94e1@o4511290535378944.ingest.us.sentry.io/4511731377438720',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

void SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useUser((state) => state.setUser);
  const clearUser = useUser((state) => state.clearUser);
  const isAuthRoute = pathname.startsWith('/auth');

  useEffect(() => {
    if (isAuthRoute) {
      void SplashScreen.hideAsync();
      return;
    }

    const fetchUser = async () => {
      let shouldHideSplash = true;
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
        shouldHideSplash = false;
        await clearUser();
        router.replace('/auth');
      } finally {
        if (shouldHideSplash) {
          void SplashScreen.hideAsync();
        }
      }
    };

    fetchUser();
  }, [isAuthRoute, router]);

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

  return <Stack screenOptions={{ headerShown: false }} />;
});
