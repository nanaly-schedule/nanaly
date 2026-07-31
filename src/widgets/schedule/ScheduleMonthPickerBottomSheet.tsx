import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import DateWheelColumn from '@/src/features/auth/ui/DateWheelColumn';
import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius12,
  spacingSpacing20,
} from '@/src/init/styles/tokens';
import { createNumberRange } from '@/src/shared/lib/date';
import BottomSheet from '@/src/shared/ui/BottomSheet';
import NText from '@/src/shared/ui/NText';

type ScheduleMonthPickerBottomSheetProps = {
  visible: boolean;
  currentMonth: string;
  onClose: () => void;
  onChangeMonth: (month: string) => void;
};

export default function ScheduleMonthPickerBottomSheet({
  visible,
  currentMonth,
  onClose,
  onChangeMonth,
}: ScheduleMonthPickerBottomSheetProps) {
  const [currentYear, currentMonthNumber] = currentMonth
    .split('-')
    .map(Number);
  const [draft, setDraft] = useState({
    year: currentYear,
    month: currentMonthNumber,
  });
  const years = useMemo(
    () => createNumberRange(currentYear - 10, currentYear + 10),
    [currentYear],
  );
  const months = useMemo(() => createNumberRange(1, 12), []);

  useEffect(() => {
    if (visible) {
      setDraft({
        year: currentYear,
        month: currentMonthNumber,
      });
    }
  }, [currentMonthNumber, currentYear, visible]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      backdropVariant="light"
      style={styles.wheelSheet}
    >
      <View style={styles.wheelRow}>
        <View pointerEvents="none" style={styles.wheelSelectionHighlight} />
        <DateWheelColumn
          items={years}
          selectedValue={draft.year}
          formatLabel={(year) => `${year}`}
          unit="년"
          unitOffset={26}
          onChange={(year) =>
            setDraft((prev) => ({
              ...prev,
              year,
            }))
          }
        />
        <DateWheelColumn
          items={months}
          selectedValue={draft.month}
          formatLabel={(month) => `${month}`}
          unit="월"
          onChange={(month) =>
            setDraft((prev) => ({
              ...prev,
              month,
            }))
          }
        />
      </View>
      <Pressable
        style={styles.confirmButton}
        onPress={() => {
          onChangeMonth(
            `${draft.year}-${String(draft.month).padStart(2, '0')}-01`,
          );
          onClose();
        }}
      >
        <NText variant="m16" style={styles.confirmText}>
          확인
        </NText>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  wheelSheet: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  wheelRow: {
    position: 'relative',
    flexDirection: 'row',
    gap: spacingSpacing20,
    marginBottom: spacingSpacing20,
  },
  wheelSelectionHighlight: {
    position: 'absolute',
    top: 91,
    left: 0,
    right: 0,
    height: 38,
    borderRadius: radiusRadius12,
    backgroundColor: '#E7EBF2',
  },
  confirmButton: {
    height: 46,
    borderRadius: radiusRadius12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: buttonColorCta,
  },
  confirmText: {
    color: backgroundColorWhite,
  },
});
