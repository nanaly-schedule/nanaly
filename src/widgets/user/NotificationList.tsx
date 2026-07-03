import { FlatList, StyleSheet } from 'react-native';

import NotificationResponse from '@/src/features/user/model/notification';
import { spacingSpaicng14 } from '@/src/init/styles/tokens';
import NotificationItem from '@/src/widgets/user/notification/NotificationItem';

interface NotificationListProps {
  notificationList: NotificationResponse[];
  onRead: (notification: NotificationResponse) => () => void;
}

export default function NotificationList({
  notificationList,
  onRead,
}: NotificationListProps) {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id}
      data={notificationList}
      renderItem={({ item }) => (
        <NotificationItem item={item} onPress={onRead(item)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpaicng14,
  },
});
