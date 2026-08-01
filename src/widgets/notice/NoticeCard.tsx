import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Notice } from '@/src/entities/notice/notice';
import * as tokens from '@/src/init/styles/tokens';
import {
  typoColorPlaceholder,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import MegaphonePrivateIcon from '@/src/shared/assets/MegaphonePrivateIcon';
import MegaphonePublicIcon from '@/src/shared/assets/MegaphonePublicIcon';

type NoticeCardProps = {
  notice: Notice;
  onPress?: () => void;
  variant?: 'card' | 'list';
};

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

function getBooleanLikeValue(value?: boolean | string | number) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.toLowerCase();

  if (
    ['true', '1', 'public', 'open', 'visible', '공개'].includes(normalizedValue)
  ) {
    return true;
  }

  if (
    ['false', '0', 'private', 'closed', 'hidden', '비공개'].includes(
      normalizedValue,
    )
  ) {
    return false;
  }

  return null;
}

function getNoticeIsPublic(notice: Notice) {
  const isPublic = getBooleanLikeValue(notice.isPublic ?? notice.public);

  if (isPublic !== null) {
    return isPublic;
  }

  const isPrivate = getBooleanLikeValue(notice.isPrivate ?? notice.private);

  if (isPrivate !== null) {
    return !isPrivate;
  }

  const visibility = [
    notice.visibility,
    notice.type,
    notice.scope,
    notice.noticeType,
  ].find((value) => typeof value === 'string');

  if (!visibility) {
    return true;
  }

  return getBooleanLikeValue(visibility) ?? true;
}

export default function NoticeCard({
  notice,
  onPress,
  variant = 'card',
}: NoticeCardProps) {
  const isList = variant === 'list';
  const createdAt = formatNoticeDate(notice.createdAt);
  const preview = notice.content?.trim() || '내용이 표시됩니다';
  const isPublic = getNoticeIsPublic(notice);
  const isRead = isList && notice.isRead === true;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={[styles.container, isList ? styles.list : styles.card]}
    >
      <View
        style={[
          styles.icon,
          !isList && styles.cardIcon,
          isList && styles.listIcon,
        ]}
      >
        <View style={styles.noticeIcon}>
          {isPublic ? (
            <MegaphonePublicIcon size={24} />
          ) : (
            <MegaphonePrivateIcon size={24} />
          )}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            isList && styles.listTitle,
            isRead && styles.readTitle,
          ]}
        >
          {notice.title}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.content,
            isList ? styles.listContent : styles.cardContent,
            isRead && styles.readTitle,
          ]}
        >
          {preview}
        </Text>
        {isList && createdAt && (
          <Text style={[styles.date, isRead && styles.readTitle]}>
            {createdAt}
          </Text>
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
    height: 64,
    marginBottom: tokens.spacingSpacing12,
    paddingHorizontal: tokens.spacingSpacing10,
    borderRadius: tokens.radiusRadius8,
    backgroundColor: tokens.basicColorWhiteBase,
  },
  list: {
    alignItems: 'flex-start',
    marginBottom: tokens.spacingSpacing10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: tokens.spacingSpaicng14,
    borderRadius: tokens.radiusRadius20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: tokens.spacingSpacing10,
  },
  noticeIcon: {
    width: 24,
    height: 24,
  },
  listIcon: {
    marginTop: tokens.spacingSpacing16,
  },
  title: {
    marginBottom: 6,
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: tokens.typographyPrimitiveLineHeight14,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
    fontWeight: '700',
    color: typoColorPrimary,
  },
  listTitle: {
    marginBottom: tokens.spacingSpacing8,
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: tokens.typographyPrimitiveLineHeight14,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing0,
  },
  readTitle: {
    color: typoColorPlaceholder,
  },
  content: {
    color: '#555555',
  },
  cardContent: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: tokens.typographyPrimitiveLineHeight14,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  listContent: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: tokens.typographyPrimitiveLineHeight14,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
  },
  date: {
    marginTop: tokens.spacingSpacing12,
    paddingBottom: tokens.spacingSpacing12,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: tokens.typographyPrimitiveFontSize12,
    lineHeight: tokens.typographyPrimitiveLineHeight14,
    letterSpacing: tokens.typographyPrimitiveLetterSpacing2,
    color: '#666666',
  },
});
