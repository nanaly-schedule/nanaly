import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import BirthDatePickerBottomSheet from '@/src/features/auth/ui/BirthDatePickerBottomSheet';
import { spacingSpacing20 } from '@/src/init/styles/tokens';
import {
  BirthDateValue,
  formatBirthDate,
  parseBirthDate,
} from '@/src/shared/lib/date';
import Input from '@/src/shared/ui/Input';

import InputLabel from '../shared/InputLabel';

interface BusinessInfoProps {
  editable?: boolean;
  businessNumber: string;
  ownerName: string;
  startDate: string;
  onChangeBusinessNumber: (t: string) => void;
  onChangeOwnerName: (t: string) => void;
  onChangeStartDate: (t: string) => void;
}

function formatBusinessRegistrationNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 5) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export default function BusinessInfo({
  editable = true,
  businessNumber,
  ownerName,
  startDate,
  onChangeBusinessNumber,
  onChangeOwnerName,
  onChangeStartDate,
}: BusinessInfoProps) {
  const [isOpenDatePickerOpen, setIsOpenDatePickerOpen] = useState(false);
  const openDate = parseBirthDate(startDate);
  const formattedBusinessNumber =
    formatBusinessRegistrationNumber(businessNumber);

  const handleChangeOpenDate = (value: BirthDateValue) => {
    onChangeStartDate(formatBirthDate(value));
  };

  const handleChangeBusinessNumber = (value: string) => {
    onChangeBusinessNumber(value.replace(/\D/g, '').slice(0, 10));
  };

  const handlePressOpenDate = () => {
    if (!editable) {
      return;
    }

    setIsOpenDatePickerOpen(true);
  };

  return (
    <View style={styles.container}>
      <View>
        <InputLabel label="사업자등록번호" />
        <Input
          editable={editable}
          placeholder="000-00-00000"
          value={formattedBusinessNumber}
          onChangeText={handleChangeBusinessNumber}
          keyboardType="number-pad"
          maxLength={12}
          variant=""
        />
      </View>
      <View>
        <InputLabel label="대표자명" />
        <Input
          editable={editable}
          placeholder="대표자명을 입력해 주세요"
          value={ownerName}
          onChangeText={onChangeOwnerName}
          variant=""
        />
      </View>
      <View>
        <InputLabel label="개업일" />
        <Input
          placeholder="개업일을 선택해 주세요"
          value={openDate ? formatBirthDate(openDate) : ''}
          variant=""
          editable={editable}
          caretHidden
          contextMenuHidden
          showSoftInputOnFocus={false}
          onFocus={handlePressOpenDate}
          onPressIn={handlePressOpenDate}
          onChangeText={() => {}}
        />
      </View>
      <BirthDatePickerBottomSheet
        visible={isOpenDatePickerOpen}
        value={openDate}
        onChange={handleChangeOpenDate}
        onClose={() => setIsOpenDatePickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacingSpacing20,
  },
});
