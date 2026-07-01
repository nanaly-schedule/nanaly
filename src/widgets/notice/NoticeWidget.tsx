import { View } from 'react-native';

import { Notice } from '@/src/entities/notice/notice';

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
            {notices.map((notice, index) => {
              const noticeId = notice.id ?? notice.noticeId;

              return (
                <NoticeCard
                    key={noticeId ?? `notice-${index}`}
                    notice={notice}
                    onPress={
                      noticeId
                        ? () => onPressNotice?.(noticeId)
                        : undefined
                    }
                />
              );
            })}
        </View>
    )}
