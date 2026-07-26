import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  brandColorPrimary,
  radiusRadius12,
  spacingSpacing8,
  spacingSpacing10,
  spacingSpacing12,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface TodayWorkerProps {
  todayWorker: number;
}

export default function TodayWorker({ todayWorker }: TodayWorkerProps) {
  return (
    <View style={styles.container}>
      <NText variant="r14" style={{ color: typoColorSub1 }}>
        오늘 근무자
      </NText>
      <View style={styles.row}>
        <NText
          variant="h1"
          style={{ color: brandColorPrimary, fontSize: 24, fontWeight: '700' }}
        >
          {todayWorker}
        </NText>
        <NText variant="m16" style={{ color: typoColorPrimary }}>
          명
        </NText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingSpacing10,
    gap: spacingSpacing12,
    borderRadius: radiusRadius12,
    justifyContent: 'center',
    backgroundColor: backgroundColorWhite,
    height: 106,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
});
