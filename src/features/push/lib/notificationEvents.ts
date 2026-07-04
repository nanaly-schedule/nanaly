export interface NotificationEventPayload {
  notificationId: string | null;
  storeId: string | null;
  targetId: string | null;
  type: string | null;
}

type NotificationEventListener = (payload: NotificationEventPayload) => void;

const listeners = new Set<NotificationEventListener>();

export function subscribeToNotificationReceived(
  listener: NotificationEventListener,
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitNotificationReceived(payload: NotificationEventPayload) {
  listeners.forEach((listener) => {
    listener(payload);
  });
}
