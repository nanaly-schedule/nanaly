import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  basicColorBlue300,
  basicColorBlue500,
  radiusRadius8,
  radiusRadius12,
  spacingSpacing8,
  spacingSpacing10,
  spacingSpacing12,
  spacingSpaicng14,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface ScheduleCardProps {
  isCurrent: boolean;
  startTime: string;
  endTime: string;
  totalTime: string;
  workDate: string;
}

export default function ScheduleCard({
  isCurrent,
  startTime,
  endTime,
  totalTime,
  workDate,
}: ScheduleCardProps) {
  return (
    <View style={styles.container}>
      <View
        style={[styles.default, isCurrent ? styles.current : styles.prevOrNext]}
      >
        <NText variant="micro" style={{ color: backgroundColorWhite }}>
          {isCurrent ? '근무중' : '근무 예정'}
        </NText>
      </View>
      <NText
        variant="b16"
        style={{ color: typoColorPrimary, marginBottom: spacingSpacing8 }}
      >
        {startTime} - {endTime}
      </NText>
      <NText
        variant="m12"
        style={{ color: typoColorPrimary, marginBottom: spacingSpaicng14 }}
      >
        {totalTime}
      </NText>
      <NText variant="micro" style={{ color: typoColorSub1 }}>
        {workDate}
      </NText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacingSpacing10,
    paddingHorizontal: spacingSpacing8,
    borderRadius: radiusRadius12,
    backgroundColor: backgroundColorWhite,
    width: 178,
    marginRight: spacingSpacing8,
  },
  default: {
    alignSelf: 'flex-start',
    borderRadius: radiusRadius8,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    marginBottom: spacingSpacing10,
  },
  current: {
    backgroundColor: basicColorBlue500,
  },
  prevOrNext: { backgroundColor: basicColorBlue300 },
});
