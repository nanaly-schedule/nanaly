import { type Href, Router } from 'expo-router';

import { NotificationType } from '@/src/entities/user/notification';
import { readNotification } from '@/src/features/user/api/notification';

interface NotificationNavigationPayload {
  notificationId?: string | null;
  storeId?: string | null;
  targetId?: string | null;
  type?: string | NotificationType | null;
}

function getStringValue(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

const scheduleReminderNotificationTypes = new Set<string>([
  NotificationType.ScheduleCreated,
  NotificationType.ScheduleUpdated,
  NotificationType.ShiftReminder,
  NotificationType.ShiftStartReminder,
  'schedule_reminder',
]);

function buildNotificationTarget(
  payload: NotificationNavigationPayload,
): Href | null {
  const storeId = getStringValue(payload.storeId);
  const targetId = getStringValue(payload.targetId);
  const type = getStringValue(payload.type);

  if (!storeId || !type) {
    return null;
  }

  switch (type) {
    case NotificationType.NoticeCreated:
      if (!targetId) {
        return null;
      }

      return {
        pathname: '/(notice)/[storeId]/notice-detail',
        params: { storeId, noticeId: targetId },
      };
    case NotificationType.ScheduleDeleted:
      return {
        pathname: '/[storeId]/schedule',
        params: { storeId },
      };
    default:
      if (!scheduleReminderNotificationTypes.has(type)) {
        return null;
      }

      if (targetId) {
        return {
          pathname: '/[storeId]/schedule',
          params: {
            storeId,
            openScheduleId: targetId,
            openScheduleModal: 'true',
          },
        };
      }

      return {
        pathname: '/[storeId]/schedule',
        params: { storeId },
      };
  }
}

export async function navigateFromNotification(
  navigator: Router,
  payload: NotificationNavigationPayload,
) {
  const target = buildNotificationTarget(payload);

  if (!target) {
    return false;
  }

  const notificationId = getStringValue(payload.notificationId);

  if (notificationId) {
    try {
      await readNotification(notificationId);
    } catch {}
  }
  navigator.push(target);
  return true;
}
