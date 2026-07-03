import { NotificationType } from '@/src/entities/user/notification';

export default interface NotificationResponse {
  id: string;
  storeName: string;
  type: NotificationType;
  title: string;
  message: string;
  targetId: string;
  isRead: boolean;
  createdAt: string; //'2026-07-02T11:04:52.930Z';
}
