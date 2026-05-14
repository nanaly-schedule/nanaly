import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  backgroundColorPrimary,
  basicColorBlue50,
  brandColorPrimary,
  spacingSpacing8,
  spacingSpaicng14,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import AlarmIcon from '@/src/shared/assets/AlarmIcon';
import NText from '@/src/shared/ui/NText';

interface StoreHeaderProps {
  storeName: string;
  isOwner: boolean;
  isActiveOwner: boolean;
}

export default function StoreHeader({
  storeName,
  isOwner,
  isActiveOwner,
}: StoreHeaderProps) {
  const route = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
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
          onPress={() =>
            isActiveOwner
              ? route.push(`/${storeId}/home`)
              : route.push(`/${storeId}/home/admin`)
          }
        >
          <NText
            variant="m12"
            style={{ color: isActiveOwner ? brandColorPrimary : typoColorSub1 }}
          >
            관리자 모드
          </NText>
        </Pressable>
      )}
      <Pressable onPress={() => route.push('/')}>
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
});
