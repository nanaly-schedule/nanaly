import { StyleSheet, View } from 'react-native';

import {
  spacingSpacing16,
  spacingSpacing20,
  spacingSpaicng14,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

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
        <NText
          variant="sb14"
          style={{ color: typoColorPrimary, marginBottom: spacingSpaicng14 }}
        >
          이름
        </NText>
        <Input
          placeholder="이름을 입력해 주세요"
          variant=""
          value={name}
          onChangeText={onNameChange}
        />
      </View>
      <View>
        <NText
          variant="sb14"
          style={{ color: typoColorPrimary, marginBottom: spacingSpaicng14 }}
        >
          생년월일
        </NText>
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
    paddingHorizontal: spacingSpacing16,
    gap: spacingSpacing20,
  },
});
