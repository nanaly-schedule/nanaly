import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import {
  backgroundColorWhite,
  radiusRadius12,
  spacingSpacing8,
  spacingSpacing10,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import RightArrowIcon from '@/src/shared/assets/RightArrowIcon';
import NText from '@/src/shared/ui/NText';

export default function StoreInfoBtn() {
  const router = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/store/${storeId}/info`)}
    >
      <NText variant="r14" style={{ color: typoColorSub1 }}>
        매장 정보
      </NText>

      <RightArrowIcon size={24} color={typoColorPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radiusRadius12,
    paddingHorizontal: spacingSpacing10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: backgroundColorWhite,
  },
});
