import { StyleSheet, View } from 'react-native';

import {
  spacingSpacing8,
  spacingSpacing12,
  spacingSpacing16,
  typoColorPrimary,
  typoColorRed,
} from '@/src/init/styles/tokens';
import CheckBox from '@/src/shared/ui/CheckBox';
import NText from '@/src/shared/ui/NText';

import InputLabel from '../../shared/InputLabel';
import InputVerifyWidget from '../../shared/InputVerifyWidget';

export interface PasswordValidationState {
  hasEnglish: boolean;
  hasNumber: boolean;
  hasMin8Length: boolean;
}

interface PasswordVerifyWidgetProps {
  password: string;
  passwordConfirm: string;
  validation: PasswordValidationState;
  isPasswordValid: boolean;
  isPasswordConfirmValid: boolean;
  onPasswordChange: (password: string) => void;
  onPasswordConfirmChange: (passwordConfirm: string) => void;
}

export default function PasswordVerifyWidget({
  password,
  passwordConfirm,
  validation,
  isPasswordValid,
  isPasswordConfirmValid,
  onPasswordChange,
  onPasswordConfirmChange,
}: PasswordVerifyWidgetProps) {
  const isPasswordError = password.length > 0 && !isPasswordValid;
  const isPasswordConfirmError =
    passwordConfirm.length > 0 && !isPasswordConfirmValid;

  return (
    <View style={styles.container}>
      <InputLabel label="비밀번호" />
      <InputVerifyWidget
        placeholder="비밀번호를 입력해주세요"
        value={password}
        isError={isPasswordError}
        onChangeText={onPasswordChange}
      />
      <View style={styles.errorConditionContainer}>
        <CheckBox isActive={validation.hasEnglish} label="영문포함" />
        <CheckBox isActive={validation.hasNumber} label="숫자포함" />
        <CheckBox isActive={validation.hasMin8Length} label="8자 이상" />
      </View>
      <InputVerifyWidget
        placeholder="비밀번호를 다시 입력해주세요"
        value={passwordConfirm}
        disabled={!isPasswordValid}
        isError={isPasswordConfirmError}
        onChangeText={onPasswordConfirmChange}
      />
      {isPasswordConfirmError && (
        <NText
          variant="m12"
          style={{ color: typoColorRed, marginTop: spacingSpacing8 }}
        >
          일치하지 않아요
        </NText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingSpacing16,
  },
  errorConditionContainer: {
    flexDirection: 'row',
    gap: spacingSpacing12,
    marginTop: spacingSpacing8,
    marginBottom: spacingSpacing12,
  },
});
