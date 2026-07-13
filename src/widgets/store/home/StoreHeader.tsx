import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MemberRole } from '@/src/entities/member/member';
import { UserStorePermissions } from '@/src/entities/user/user';
import { getMyStore } from '@/src/features/store/api/store';
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

type MyStoreItem = {
  storeId: string;
  storeName: string;
  role: MemberRole;
  permissions: UserStorePermissions;
};

export default function StoreHeader({
  storeName,
  isOwner,
  isActiveOwner,
  unreadNotificationCount = 0,
}: StoreHeaderProps) {
  const route = useRouter();
  const setUser = useUser((state) => state.setUser);
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
  const [storeListVisible, setStoreListVisible] = useState(false);
  const [stores, setStores] = useState<MyStoreItem[]>([]);
  const [storesLoading, setStoresLoading] = useState(false);
  const canJoinStore = !isOwner;

  const handlePressStoreName = async () => {
    const nextVisible = !storeListVisible;

    setStoreListVisible(nextVisible);

    if (!nextVisible || stores.length > 0 || storesLoading) {
      return;
    }

    setStoresLoading(true);

    try {
      const { data } = await getMyStore();
      setStores(Array.isArray(data) ? data : []);
    } catch {
      setStores([]);
    } finally {
      setStoresLoading(false);
    }
  };

  const handleSelectStore = (store: MyStoreItem) => {
    setStoreListVisible(false);
    setUser({
      currentStoreAccessLoaded: true,
      currentStoreId: store.storeId,
      currentStoreRole: store.role,
      currentStorePermissions: store.permissions,
    });
    route.replace({
      pathname: isActiveOwner ? '/[storeId]/home/admin' : '/[storeId]/home',
      params: {
        storeId: store.storeId,
        displayStoreName: store.storeName,
        isOwner: String(store.role !== MemberRole.STAFF),
      },
    });
  };

  const handlePressAddStore = () => {
    setStoreListVisible(false);
    route.push('/store/join');
  };

  return (
    <View style={styles.container}>
      <View style={styles.storeSelector}>
        <Pressable onPress={handlePressStoreName} style={styles.storeNameButton}>
          <NText variant="h2" style={styles.storeName}>
            {displayStoreName}
          </NText>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={typoColorPrimary}
            style={styles.chevron}
          />
        </Pressable>
        {storeListVisible && (
          <View style={styles.storeDropdown}>
            <View>
              {storesLoading ? (
                <View style={styles.storeOption}>
                  <NText variant="r14" style={styles.storeOptionText}>
                    불러오는 중...
                  </NText>
                </View>
              ) : stores.length === 0 ? (
                <View style={styles.storeOption}>
                  <NText variant="r14" style={styles.storeOptionText}>
                    매장이 없어요
                  </NText>
                </View>
              ) : (
                stores.map((store) => (
                  <Pressable
                    key={store.storeId}
                    style={styles.storeOption}
                    onPress={() => handleSelectStore(store)}
                  >
                    <NText
                      variant="r14"
                      numberOfLines={1}
                      style={styles.storeOptionText}
                    >
                      {store.storeName}
                    </NText>
                  </Pressable>
                ))
              )}
            </View>
            {canJoinStore && (
              <Pressable
                style={[styles.storeOption, styles.addStoreOption]}
                onPress={handlePressAddStore}
              >
                <NText variant="r14" style={styles.addStoreOptionText}>
                  매장 추가
                </NText>
              </Pressable>
            )}
          </View>
        )}
      </View>
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
    position: 'relative',
    zIndex: 10,
  },
  storeSelector: {
    flex: 1,
    position: 'relative',
    marginRight: 'auto',
  },
  storeNameButton: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeName: {
    flexShrink: 1,
  },
  chevron: {
    transform: [{ rotate: '90deg' }],
  },
  storeDropdown: {
    position: 'absolute',
    top: 38,
    left: 0,
    width: 150,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
    zIndex: 20,
  },
  storeOption: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  storeOptionText: {
    color: typoColorPrimary,
  },
  addStoreOption: {
    borderTopWidth: 1,
    borderTopColor: backgroundColorPrimary,
  },
  addStoreOptionText: {
    color: brandColorPrimary,
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
