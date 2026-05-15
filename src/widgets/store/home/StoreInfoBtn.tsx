import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { canAccessStoreInfo } from '@/src/features/permission/lib/access';
import useCurrentStoreAccess from '@/src/features/permission/lib/useCurrentStoreAccess';
import {
  backgroundColorWhite,
  radiusRadius12,
  spacingSpacing8,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import RightArrowIcon from '@/src/shared/assets/RightArrowIcon';
import NText from '@/src/shared/ui/NText';

export default function StoreInfoBtn() {
  const router = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const access = useCurrentStoreAccess();

  if (!canAccessStoreInfo(access)) {
    return null;
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/store/${storeId}/info`)}
    >
      <NText variant="r14" style={{ color: typoColorSub1 }}>
        가게 관리
      </NText>

      <RightArrowIcon size={10} color={typoColorPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radiusRadius12,
    paddingHorizontal: spacingSpacing8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: backgroundColorWhite,
  },
});
