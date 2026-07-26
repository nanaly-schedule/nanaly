import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import * as Notifications from 'expo-notifications';
import {
  Stack,
  useNavigationContainerRef,
  usePathname,
  useRouter,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';

import { getAccessToken } from '@/src/features/auth/lib/storage';
import { emitNotificationReceived } from '@/src/features/push/lib/notificationEvents';
import { preparePushNotificationsAsync } from '@/src/features/push/lib/pushNotification';
import { getMyStore } from '@/src/features/store/api/store';
import { getUserProfile } from '@/src/features/user/api/profile';
import { navigateFromNotification } from '@/src/features/user/lib/notificationNavigation';
import useUser from '@/src/features/user/lib/useUser';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

const SENSITIVE_KEYS = new Set([
  'password',
  'authorization',
  'cookie',
  'set-cookie',
  'accessToken',
  'refreshToken',
  'identityToken',
  'idToken',
  'expoPushToken',
  'businessRegistrationNumber',
]);

function scrubSensitiveData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(scrubSensitiveData);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, currentValue]) => [
      key,
      SENSITIVE_KEYS.has(key) ? '[REDACTED]' : scrubSensitiveData(currentValue),
    ]),
  );
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: __DEV__ ? 1 : 0.2,
  profilesSampleRate: __DEV__ ? 1 : 0.1,
  sendDefaultPii: true,
  enableLogs: true,
  enableNativeFramesTracking: !isRunningInExpoGo(),
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
  beforeSend(event) {
    event.contexts = scrubSensitiveData(
      event.contexts,
    ) as typeof event.contexts;
    event.extra = scrubSensitiveData(event.extra) as typeof event.extra;

    if (event.request) {
      event.request.headers = scrubSensitiveData(
        event.request.headers,
      ) as typeof event.request.headers;
      event.request.data = scrubSensitiveData(
        event.request.data,
      ) as typeof event.request.data;
    }

    return event;
  },
  beforeBreadcrumb(breadcrumb) {
    if (!breadcrumb.data) {
      return breadcrumb;
    }

    return {
      ...breadcrumb,
      data: scrubSensitiveData(breadcrumb.data) as
        | Record<string, unknown>
        | undefined,
    };
  },
});

void SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function Layout() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();
  const pathname = usePathname();
  const setUser = useUser((state) => state.setUser);
  const clearUser = useUser((state) => state.clearUser);
  const handledNotificationResponseKeyRef = useRef<string | null>(null);
  const isAuthRoute = pathname.startsWith('/auth');

  useEffect(() => {
    if (navigationRef) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  useEffect(() => {
    if (isAuthRoute) {
      Sentry.setUser(null);
      void SplashScreen.hideAsync();
      return;
    }

    const fetchUser = async () => {
      let shouldHideSplash = true;
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          shouldHideSplash = false;
          router.replace('/auth');
          return;
        }
        const { data } = await getUserProfile();
        const { name, email, birthDate, isTempPassword } = data;
        setUser({
          isTempPassword,
          name,
          email,
          birthDate,
        });
        Sentry.setUser({
          email,
          username: name,
        });

        try {
          await preparePushNotificationsAsync();
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              area: 'bootstrap',
              action: 'preparePushNotifications',
            },
          });
        }

        if (pathname === '/') {
          const { data: myStores } = await getMyStore();

          shouldHideSplash = false;
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
          return;
        }
      } catch (error) {
        shouldHideSplash = false;
        Sentry.captureException(error, {
          tags: {
            area: 'bootstrap',
            action: 'getUserProfile',
          },
        });
        await clearUser();
      } finally {
        if (shouldHideSplash) {
          void SplashScreen.hideAsync();
        }
      }
    };

    fetchUser();
  }, [clearUser, isAuthRoute, pathname, router, setUser]);

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
      const notificationId =
        typeof data.notificationId === 'string' ? data.notificationId : null;
      const storeId = typeof data.storeId === 'string' ? data.storeId : null;
      const targetId = typeof data.targetId === 'string' ? data.targetId : null;
      const type = typeof data.type === 'string' ? data.type : null;
      const responseKey =
        notificationId ?? [storeId, type, targetId].filter(Boolean).join(':');

      if (
        responseKey &&
        handledNotificationResponseKeyRef.current === responseKey
      ) {
        return;
      }

      handledNotificationResponseKeyRef.current = responseKey;

      await navigateFromNotification(router, {
        notificationId,
        storeId,
        targetId,
        type,
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
