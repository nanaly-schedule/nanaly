import { StyleSheet, View } from 'react-native';

import { spacingSpacing20 } from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';

import InputLabel from '../../shared/InputLabel';

interface AuthInfoProps {
  name: string;
  birthDate: string;
  onNameChange: (name: string) => void;
  onBirthDateFocus: () => void;
}

export default function AuthInfo({
  name,
  birthDate,
  onNameChange,
  onBirthDateFocus,
}: AuthInfoProps) {
  return (
    <View style={styles.container}>
      <View>
        <InputLabel label="이름" />
        <Input
          placeholder="이름을 입력해 주세요"
          variant=""
          value={name}
          onChangeText={onNameChange}
        />
      </View>
      <View>
        <InputLabel label="생년월일" />
        <Input
          placeholder="생년월일을 선택해 주세요"
          variant=""
          value={birthDate}
          caretHidden
          contextMenuHidden
          showSoftInputOnFocus={false}
          onFocus={onBirthDateFocus}
          onPressIn={onBirthDateFocus}
          onChangeText={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpacing20,
    gap: spacingSpacing20,
  },
});
