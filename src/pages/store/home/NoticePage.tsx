import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import { Notice } from '@/src/entities/notice/notice';
import { getNotices, NoticeFilter } from '@/src/features/notice/api/notice';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
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
  const access = useCurrentStoreAccess();
  const canViewPrivateNotice =
    access.isOwner || access.role === MemberRole.MANAGER;
  const canManageNotice =
    access.isOwner ||
    (access.role === MemberRole.MANAGER &&
      !!access.permissions?.canManageNotice);

  const [tab, setTab] = useState<NoticeTabType>('all');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (!access.loaded || !storeId) {
        return;
      }

      const fetchNotices = async () => {
        try {
          setLoading(true);

          const filter: NoticeFilter | undefined = !canViewPrivateNotice
            ? 'public'
            : tab === 'all'
              ? undefined
              : tab;

          const { data } = await getNotices(storeId, filter);
          setNotices(data);
        } catch {
          setNotices([]);
        } finally {
          setLoading(false);
        }
      };

      fetchNotices();
    }, [access.loaded, canViewPrivateNotice, storeId, tab]),
  );

  if (!access.loaded) {
    return <View />;
  }

  return (
    <PageLayout title="공지사항">
      {canViewPrivateNotice && (
        <View style={styles.tabsWrapper}>
          <NoticeTabs
            value={tab}
            onChange={setTab}
          />
        </View>
      )}

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && <NText variant="r14">불러오는 중...</NText>}

        {!loading && notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            variant="list"
            onPress={() => {
              router.push({
                pathname: '/(notice)/[storeId]/notice-detail',
                params: { storeId, noticeId: notice.id },
              });
            }}
          />
        ))}
      </ScrollView>

      {canManageNotice && (
        <Pressable
          style={styles.floatingButton}
          onPress={() => {
            router.push({
              pathname: '/(notice)/[storeId]/notice-create',
              params: { storeId },
            });
          }}
        >
          <Ionicons
            name="add"
            size={28}
            color="#fff"
          />
        </Pressable>
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    marginTop: 16,
  },
  list: {
    flex: 1,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 96,
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
