import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Notice } from '@/src/entities/notice/notice';

type NoticeCardProps = {
  notice: Notice;
  onPress?: () => void;
  variant?: 'card' | 'list';
}

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

export default function NoticeCard({
  notice,
  onPress,
  variant = 'card',
}: NoticeCardProps) {
    const isList = variant === 'list';
    const createdAt = formatNoticeDate(notice.createdAt);

    return (
        <Pressable
            disabled={!onPress}
            onPress={onPress}
            style={[styles.container, isList ? styles.list : styles.card]}
        >
        <View
            style={[
                styles.icon,
                isList && styles.listIcon,
                {
                    backgroundColor: notice.isPublic
                        ? '#86BEFF'
                        : '#D9D9D9',
                },
            ]}
            >
                <Ionicons
                    name="megaphone-outline"
                    size={20}
                    color="#fff"
                />
            </View>
            <View style={{flex: 1}}>
                <Text
                    numberOfLines={1}
                    style={[styles.title, isList && styles.listTitle]}
                >
                    {notice.title}
                </Text>
                <Text
                    numberOfLines={2}
                    style={styles.content}
                >
                    {notice.content?.trim() || '내용이 표시됩니다'}
                </Text>
                {isList && createdAt && (
                    <Text style={styles.date}>{createdAt}</Text>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  list: {
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 14,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIcon: {
    marginTop: 16,
  },
  title: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  listTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },
  date: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 18,
    color: '#666666',
  },
});
