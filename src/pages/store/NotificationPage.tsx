import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { subscribeToNotificationReceived } from '@/src/features/push/lib/notificationEvents';
import { getNotifications } from '@/src/features/user/api/notification';
import { navigateFromNotification } from '@/src/features/user/lib/notificationNavigation';
import NotificationResponse from '@/src/features/user/model/notification';
import PageLayout from '@/src/shared/ui/PageLayout';
import NotificationList from '@/src/widgets/user/NotificationList';

export default function NotificationPage() {
  const route = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [pendingNotificationId, setPendingNotificationId] = useState<
    string | null
  >(null);
  const storeIdRef = useRef(storeId);

  useEffect(() => {
    storeIdRef.current = storeId;
  }, [storeId]);

  const fetchNotifications = async (nextStoreId: string) => {
    try {
      const { data } = await getNotifications({ storeId: nextStoreId });
      setNotifications(data);
    } catch {}
  };

  useEffect(() => {
    void fetchNotifications(storeId);
  }, [storeId]);

  useEffect(() => {
    return subscribeToNotificationReceived((payload) => {
      const currentStoreId = storeIdRef.current;

      if (payload.storeId && payload.storeId !== currentStoreId) {
        return;
      }

      void fetchNotifications(currentStoreId);
    });
  }, []);

  const handleReadNotification =
    (notification: NotificationResponse) => async () => {
      if (pendingNotificationId === notification.id) {
        return;
      }

      setPendingNotificationId(notification.id);

      try {
        await navigateFromNotification(route, {
          notificationId: notification.id,
          storeId,
          targetId: notification.targetId,
          type: notification.type,
        });
      } catch {
      } finally {
        setPendingNotificationId((currentId) =>
          currentId === notification.id ? null : currentId,
        );
      }
    };
  return (
    <PageLayout showHeader showBackButton title="알림">
      <NotificationList
        notificationList={notifications}
        onRead={handleReadNotification}
      />
    </PageLayout>
  );
}
