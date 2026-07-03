import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import useUser from '@/src/features/user/lib/useUser';
import {
  backgroundColorPrimary,
  basicColorBlue50,
  brandColorPrimary,
  spacingSpacing8,
  spacingSpaicng14,
  typoColorPrimary,
  typoColorRed,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import AlarmIcon from '@/src/shared/assets/AlarmIcon';
import NText from '@/src/shared/ui/NText';

interface StoreHeaderProps {
  storeName: string;
  isOwner: boolean;
  isActiveOwner: boolean;
  unreadNotificationCount?: number;
}

export default function StoreHeader({
  storeName,
  isOwner,
  isActiveOwner,
  unreadNotificationCount = 0,
}: StoreHeaderProps) {
  const route = useRouter();
  const { storeId: routeStoreId } = useLocalSearchParams<{
    storeId?: string | string[];
  }>();
  const currentStoreId = useUser((state) => state.currentStoreId);
  const rawStoreId = Array.isArray(routeStoreId)
    ? routeStoreId[0]
    : routeStoreId;
  const storeId =
    rawStoreId && rawStoreId !== 'undefined' && rawStoreId !== 'null'
      ? rawStoreId
      : currentStoreId;
  const displayStoreName =
    storeName.length > 10 ? `${storeName.slice(0, 10)}...` : storeName;

  return (
    <View style={styles.container}>
      <NText variant="h2" style={{ marginRight: 'auto' }}>
        {displayStoreName}
      </NText>
      {isOwner && (
        <Pressable
          style={[styles.default, isActiveOwner && styles.active]}
          onPress={() => {
            if (!storeId) {
              return;
            }

            if (isActiveOwner) {
              route.push({
                pathname: `/[storeId]/home`,
                params: { storeId, displayStoreName, isOwner: 'true' },
              });
              return;
            }

            route.push({
              pathname: `/[storeId]/home/admin`,
              params: { storeId, displayStoreName, isOwner: 'true' },
            });
          }}
        >
          <NText
            variant="m12"
            style={{ color: isActiveOwner ? brandColorPrimary : typoColorSub1 }}
          >
            관리자 모드
          </NText>
        </Pressable>
      )}
      <Pressable
        style={styles.alarmButton}
        onPress={() => route.push(`/store/${storeId}/notification`)}
      >
        {unreadNotificationCount > 0 && <View style={styles.unreadDot} />}
        <AlarmIcon size={20} color={typoColorPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    gap: spacingSpacing8,
    alignItems: 'center',
    marginBottom: spacingSpaicng14,
  },
  default: {
    borderRadius: 9999,
    paddingHorizontal: spacingSpacing8,
    height: 28,
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: backgroundColorPrimary,
  },
  active: {
    backgroundColor: basicColorBlue50,
  },
  alarmButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    left: 1,
    width: 7,
    height: 7,
    borderRadius: 9999,
    backgroundColor: typoColorRed,
    zIndex: 1,
  },
});
