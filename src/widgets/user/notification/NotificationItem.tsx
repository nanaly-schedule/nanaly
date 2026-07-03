import { Pressable, StyleSheet, View } from 'react-native';

import NotificationResponse from '@/src/features/user/model/notification';
import {
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing24,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface NotificationItemProps {
  item: NotificationResponse;
  onPress: () => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatNotificationDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}

export default function NotificationItem({
  item,
  onPress,
}: NotificationItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <NText variant="b12" style={styles.title}>
        {item.title}{' '}
        <NText variant="m12" style={styles.message}>
          {item.message}
        </NText>
      </NText>
      <NText variant="r12" style={styles.date}>
        {formatNotificationDate(item.createdAt)}
      </NText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingBottom: spacingSpacing12,
  },
  title: {
    color: typoColorPrimary,
    marginBottom: spacingSpacing12,
  },
  message: {
    color: typoColorPrimary,
  },
  date: {
    color: typoColorSub1,
    marginBottom: spacingSpacing12,
  },
});
