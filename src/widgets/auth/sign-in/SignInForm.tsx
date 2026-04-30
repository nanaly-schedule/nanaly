import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  backgroundColorPrimary,
  brandColorPrimary,
  radiusRadius12,
  spacingSpacing12,
  spacingSpacing16,
} from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

import AuthLinks from './AuthLinks';
import OrDivider from './OrDivider';

interface SignInFormProps {
  onPressStateChange?: (pressed: boolean) => void;
  onSubmit?: (data: { email: string; password: string }) => void | Promise<void>;
}

export default function SignInForm({
  onPressStateChange,
  onSubmit,
}: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        />
        <Input
          placeholder="비밀번호를 입력해주세요"
          variant=""
          value={password}
          onChangeText={setPassword}
          textContentType="password"
          secureTextEntry
        />
      </View>
      <Pressable
        style={styles.cta}
        onPressIn={() => onPressStateChange?.(true)}
        onPressOut={() => onPressStateChange?.(false)}
        onPress={() =>
          onSubmit?.({
            email: email.trim(),
            password,
          })
        }
      >
        <NText variant="m16" style={styles.ctaText}>
          로그인
        </NText>
      </Pressable>
      <AuthLinks />
      <OrDivider />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    gap: spacingSpacing12,
    marginBottom: spacingSpacing16,
  },
  cta: {
    borderRadius: radiusRadius12,
    height: 46,
    backgroundColor: brandColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: backgroundColorPrimary,
  },
});
