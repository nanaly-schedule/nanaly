import { Pressable, StyleSheet } from 'react-native';

import NotificationResponse from '@/src/features/user/model/notification';
import {
  spacingSpacing12,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import { formatKoreanDateWithWeekday } from '@/src/shared/lib/date';
import NText from '@/src/shared/ui/NText';

interface NotificationItemProps {
  item: NotificationResponse;
  onPress: () => void;
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
        {formatKoreanDateWithWeekday(item.createdAt)}
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
