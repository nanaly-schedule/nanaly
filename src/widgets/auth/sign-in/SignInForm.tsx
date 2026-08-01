import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';

import { spacingSpacing12 } from '@/src/init/styles/tokens';
import CtaButton from '@/src/shared/ui/CtaButton';
import Input from '@/src/shared/ui/Input';

import AuthLinks from './AuthLinks';
import OrDivider from './OrDivider';

interface SignInFormProps {
  onPressStateChange?: (pressed: boolean) => void;
  onSubmit?: (data: {
    email: string;
    password: string;
  }) => void | Promise<void>;
}

export default function SignInForm({
  onPressStateChange,
  onSubmit,
}: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    Keyboard.dismiss();
    onSubmit?.({
      email: email.trim(),
      password,
    });
  };

  return (
    <View>
      <View style={styles.input}>
        <Input
          placeholder="아이디를 입력해주세요"
          variant=""
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <Input
          ref={passwordInputRef}
          placeholder="비밀번호를 입력해주세요"
          variant=""
          value={password}
          onChangeText={setPassword}
          textContentType="password"
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>
      <CtaButton
        onPressIn={() => onPressStateChange?.(true)}
        onPressOut={() => onPressStateChange?.(false)}
        onPress={handleSubmit}
      >
        <CtaButton.Text>로그인</CtaButton.Text>
      </CtaButton>
      <AuthLinks />
      <OrDivider />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    gap: spacingSpacing12,
  },
});
