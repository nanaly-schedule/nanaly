import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Notice } from '@/src/entities/notice/notice';
import { getNotice, updateNotice } from '@/src/features/notice/api/notice';
import {
  typoColorPrimary,
  typoColorSecondary,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';
import PageLayout from '@/src/shared/ui/PageLayout';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatNoticeDate(createdAt?: string) {
  if (!createdAt) {
    return '';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;
}

export default function NoticeDetailPage() {
  const router = useRouter();
  const { storeId, noticeId } = useLocalSearchParams<{
    storeId: string;
    noticeId: string;
  }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!storeId || !noticeId) {
        setErrorMessage('공지 정보를 확인할 수 없어요.');
        setLoading(false);
        return;
      }

      const fetchNotice = async () => {
        try {
          setLoading(true);
          setErrorMessage(null);

          const { data } = await getNotice(storeId, noticeId);
          setNotice(data);
        } catch {
          setErrorMessage('공지를 불러오지 못했어요.');
        } finally {
          setLoading(false);
        }
      };

      fetchNotice();
    }, [storeId, noticeId]),
  );

  const handleToggleVisibility = async () => {
    if (!notice || !storeId || !noticeId || updatingVisibility) {
      return;
    }

    if (!notice.content?.trim()) {
      setMenuVisible(false);
      setErrorMessage('공지 내용이 없어 공개 상태를 변경할 수 없어요.');
      return;
    }

    try {
      setUpdatingVisibility(true);
      setErrorMessage(null);

      await updateNotice(storeId, noticeId, {
        title: notice.title,
        content: notice.content,
        isPublic: !notice.isPublic,
      });

      setNotice((current) =>
        current ? { ...current, isPublic: !current.isPublic } : current,
      );
      setMenuVisible(false);
    } catch (error) {
      setMenuVisible(false);

      if (isAxiosError(error) && error.response?.status === 403) {
        setErrorMessage('공지 공개 상태를 변경할 권한이 없어요.');
      } else {
        setErrorMessage('공지 공개 상태를 변경하지 못했어요.');
      }
    } finally {
      setUpdatingVisibility(false);
    }
  };

  const handlePressEdit = () => {
    setMenuVisible(false);
    router.push({
      pathname: '/(notice)/[storeId]/notice-create',
      params: { storeId, noticeId },
    });
  };

  const createdAt = formatNoticeDate(notice?.createdAt);
  const metaItems = [
    createdAt,
    notice?.authorName,
    notice ? (notice.isPublic ? '공개' : '비공개') : '',
  ].filter(Boolean);

  return (
    <PageLayout
      title="공지사항"
      icon={
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={typoColorPrimary}
        />
      }
      onPressCheckIcon={() => setMenuVisible((visible) => !visible)}
    >
      {menuVisible && (
        <>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              disabled={updatingVisibility}
              onPress={handleToggleVisibility}
            >
              <NText variant="r14" style={styles.menuText}>
                {updatingVisibility
                  ? '변경 중'
                  : notice?.isPublic
                    ? '비공개로 전환'
                    : '공개로 전환'}
              </NText>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={handlePressEdit}
            >
              <NText variant="r14" style={styles.menuText}>
                수정
              </NText>
            </Pressable>
          </View>
        </>
      )}

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {loading && <NText variant="r14">불러오는 중...</NText>}

        {!loading && errorMessage && (
          <NText variant="r14">{errorMessage}</NText>
        )}

        {!loading && notice && (
          <>
            <NText variant="h2" style={styles.title}>
              {notice.title}
            </NText>

            <View style={styles.metaContainer}>
              {metaItems.map((item, index) => (
                <View key={`${index}-${item}`} style={styles.metaItem}>
                  {index > 0 && <View style={styles.divider} />}
                  <NText variant="r14" style={styles.metaText}>
                    {item}
                  </NText>
                </View>
              ))}
            </View>

            <View style={styles.contentContainer}>
              <NText variant="r14l" style={styles.content}>
                {notice.content?.trim() || '내용이 표시됩니다'}
              </NText>
            </View>
          </>
        )}
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    zIndex: 2,
    top: 48,
    right: 0,
    width: 180,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  menuItem: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  menuText: {
    color: typoColorSecondary,
  },
  container: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    color: typoColorPrimary,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: typoColorSecondary,
  },
  divider: {
    width: 1,
    height: 14,
    marginHorizontal: 10,
    backgroundColor: '#D9D9D9',
  },
  contentContainer: {
    marginTop: 28,
  },
  content: {
    color: typoColorPrimary,
  },
});
