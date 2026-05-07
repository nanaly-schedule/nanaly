import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import BirthDatePickerBottomSheet from '@/src/features/auth/ui/BirthDatePickerBottomSheet';
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

  const handleChangeOpenDate = (value: BirthDateValue) => {
    onChangeStartDate(formatBirthDate(value));
  };

  return (
    <View style={styles.container}>
      <View>
        <InputLabel label="사업자등록번호" />
        <Input
          editable={editable}
          placeholder="000-00-00000"
          value={businessNumber}
          onChangeText={onChangeBusinessNumber}
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
        <Pressable
          disabled={!editable}
          onPress={() => setIsOpenDatePickerOpen(true)}
        >
          <Input
            placeholder="개업일을 선택해 주세요"
            value={openDate ? formatBirthDate(openDate) : ''}
            variant=""
            editable={false}
          />
        </Pressable>
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
    gap: 21,
  },
});
