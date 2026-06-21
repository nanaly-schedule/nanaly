import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PageLayout from '@/src/shared/ui/PageLayout';
import NoticeCard, {
  Notice,
} from '@/src/widgets/notice/NoticeCard';
import NoticeTabs, {
  NoticeTabType,
} from '@/src/widgets/notice/NoticeTabs';

const MOCK_NOTICES: Notice[] = [
  {
    id: 1,
    title: '[필독] 이번 주말 야간 근무자 유의사항',
    content:
      '매장 청소 및 재고 확인 체크리스트를 반드시 확인해 주세요.',
    createdAt: '2026.06.21',
  },
  {
    id: 2,
    title: '매장 청소 체크리스트 업데이트 안내',
    content: '새로운 청소 구역이 추가되었습니다.',
    createdAt: '2026.06.20',
  },
  {
    id: 3,
    title: '급여 정산 관련 공지',
    content: '급여 정산 일정이 변경되었습니다.',
    createdAt: '2026.06.19',
  },
];

export default function NoticePage() {
  const [tab, setTab] = useState<NoticeTabType>('all');

  const notices = MOCK_NOTICES;

  return (
    <PageLayout title="공지">
      <NoticeTabs
        value={tab}
        onChange={setTab}
      />

      <View style={styles.list}>
        {notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
          />
        ))}
      </View>

      <Pressable
        style={styles.floatingButton}
        onPress={() => {
          console.log('공지 작성');
        }}
      >
        <Ionicons
          name="add"
          size={28}
          color="#fff"
        />
      </Pressable>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 16,
  },

  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,

    width: 56,
    height: 56,

    borderRadius: 28,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#6EA8FF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    elevation: 4,
  },
});