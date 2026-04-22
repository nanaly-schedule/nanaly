import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  buttonColorCta,
  radiusRadius12,
  radiusRadius20,
  spacingSpacing20,
} from '@/src/init/styles/tokens';
import {
  BirthDateValue,
  createNumberRange,
  defaultBirthDate,
  getDaysInMonth,
} from '@/src/shared/lib/date';
import BottomSheet from '@/src/shared/ui/BottomSheet';
import NText from '@/src/shared/ui/NText';

import DateWheelColumn from './DateWheelColumn';

interface BirthDatePickerBottomSheetProps {
  visible: boolean;
  value: BirthDateValue | null;
  onChange: (value: BirthDateValue) => void;
  onClose: () => void;
}

export default function BirthDatePickerBottomSheet({
  visible,
  value,
  onChange,
  onClose,
}: BirthDatePickerBottomSheetProps) {
  const [draft, setDraft] = useState<BirthDateValue>(defaultBirthDate);

  const years = useMemo(() => createNumberRange(1900, 2026), []);
  const months = useMemo(() => createNumberRange(1, 12), []);
  const days = useMemo(
    () => createNumberRange(1, getDaysInMonth(draft.year, draft.month)),
    [draft.month, draft.year],
  );

  useEffect(() => {
    if (visible) {
      setDraft(value ?? defaultBirthDate);
    }
  }, [value, visible]);

  const updateDraft = (nextValue: Partial<BirthDateValue>) => {
    setDraft((prev) => {
      const next = { ...prev, ...nextValue };
      const maxDay = getDaysInMonth(next.year, next.month);
      return {
        ...next,
        day: Math.min(next.day, maxDay),
      };
    });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.picker}>
        <DateWheelColumn
          items={years}
          selectedValue={draft.year}
          formatLabel={(year, isSelected) =>
            isSelected ? `${year}년` : String(year)
          }
          onChange={(year) => updateDraft({ year })}
        />
        <DateWheelColumn
          items={months}
          selectedValue={draft.month}
          formatLabel={(month, isSelected) =>
            isSelected ? `${month} 월` : String(month)
          }
          onChange={(month) => updateDraft({ month })}
        />
        <DateWheelColumn
          items={days}
          selectedValue={draft.day}
          formatLabel={(day, isSelected) =>
            isSelected
              ? `${String(day).padStart(2, '0')}일`
              : String(day).padStart(2, '0')
          }
          onChange={(day) => updateDraft({ day })}
        />
      </View>
      <Pressable
        style={styles.confirmButton}
        onPress={() => {
          onChange(draft);
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
  picker: {
    flexDirection: 'row',
    gap: spacingSpacing20,
    marginBottom: spacingSpacing20,
  },
  confirmButton: {
    height: 46,
    borderRadius: radiusRadius12,
    backgroundColor: buttonColorCta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: backgroundColorWhite,
  },
});
