import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Notice } from '@/src/entities/notice/notice';
import { getNotices, NoticeFilter } from '@/src/features/notice/api/notice';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';
import NoticeCard from '@/src/widgets/notice/NoticeCard';
import NoticeTabs, {
  NoticeTabType,
} from '@/src/widgets/notice/NoticeTabs';
// const MOCK_NOTICES: Notice[] = [
//   {
//     id: 1,
//     title: '[필독] 이번 주말 야간 근무자 유의사항',
//     content:
//       '매장 청소 및 재고 확인 체크리스트를 반드시 확인해 주세요.',
//     createdAt: '2026.06.21',
//   },
//   {
//     id: 2,
//     title: '매장 청소 체크리스트 업데이트 안내',
//     content: '새로운 청소 구역이 추가되었습니다.',
//     createdAt: '2026.06.20',
//   },
//   {
//     id: 3,
//     title: '급여 정산 관련 공지',
//     content: '급여 정산 일정이 변경되었습니다.',
//     createdAt: '2026.06.19',
//   },
// ];

export default function NoticePage() {
const { storeId } = useLocalSearchParams<{ storeId: string }>();

  const [tab, setTab] = useState<NoticeTabType>('all');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if(!storeId) {return;}

    const fetchNotices = async () => {
      try {
        setLoading(true);

        const filter: NoticeFilter | undefined =
          tab === 'all' ? undefined : tab;
          
        const { data } = await getNotices(storeId, filter);

        console.log('공지 목록 응답:', data);
        setNotices(data);
      } catch (error) {
        console.error('공지 목록 조회 실패:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [storeId, tab]);

  return (
    <PageLayout title="공지">
      <NoticeTabs
        value={tab}
        onChange={setTab}
      />

      <View style={styles.list}>
        {loading && <NText variant="r14">불러오는 중...</NText>}

        {!loading && notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            onPress={() => {
              router.push({
                pathname: '/(notice)/[storeId]/notice-detail',
                params: { storeId, noticeId: notice.id },
              });
            }}
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
