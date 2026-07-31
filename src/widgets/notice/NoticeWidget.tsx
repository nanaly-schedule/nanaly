import { StyleSheet, View } from 'react-native';

import { Notice } from '@/src/entities/notice/notice';
import * as tokens from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

import NoticeCard from './NoticeCard';
import NoticeHeader from './NoticeHeader';

type NoticeWidgetProps = {
  notices: Notice[];
  onPressHeader?: () => void;
  onPressNotice?: (noticeId: string) => void;
};

export default function NoticeWidget({
  notices,
  onPressHeader,
  onPressNotice,
}: NoticeWidgetProps) {
  return (
    <View>
      <NoticeHeader onPress={onPressHeader} />
      {notices.length === 0 ? (
        <View style={styles.emptyState}>
          <NText variant="m12" style={styles.emptyText}>
            등록된 공지가 없어요
          </NText>
        </View>
      ) : (
        notices.map((notice, index) => {
          const noticeId = notice.id ?? notice.noticeId;

          return (
            <NoticeCard
              key={noticeId ?? `notice-${index}`}
              notice={notice}
              onPress={
                noticeId ? () => onPressNotice?.(noticeId) : undefined
              }
            />
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 118,
  },
  emptyText: {
    color: tokens.typoColorSub2,
    textAlign: 'center',
  },
});
