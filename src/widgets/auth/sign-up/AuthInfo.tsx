import { StyleSheet, View } from 'react-native';

import { spacingSpacing20 } from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';

import InputLabel from '../../shared/InputLabel';

interface AuthInfoProps {
  name: string;
  onNameChange: (name: string) => void;
}

export default function AuthInfo({
  name,
  onNameChange,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpacing20,
    gap: spacingSpacing20,
  },
});
