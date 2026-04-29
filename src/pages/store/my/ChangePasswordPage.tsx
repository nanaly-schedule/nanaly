import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import useUser from '@/src/features/user/lib/useUser';
import {
  spacingSpacing8,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpaicng14,
  typoColorRed,
} from '@/src/init/styles/tokens';
import CheckBox from '@/src/shared/ui/CheckBox';
import NText from '@/src/shared/ui/NText';
import { PasswordValidationState } from '@/src/widgets/auth/sign-up/PasswordVerifyWidget';
import InputVerifyWidget from '@/src/widgets/shared/InputVerifyWidget';
import ChangeButton from '@/src/widgets/user/ChangeButton';
import PasswordHeader from '@/src/widgets/user/PasswordHeader';

export default function ChangePasswordPage() {
  const user = useUser();

  const { isTempPassword } = user;

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const passwordValidation: PasswordValidationState = {
    hasEnglish: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasMin8Length: password.length >= 8,
  };
  const isPasswordValid =
    passwordValidation.hasEnglish &&
    passwordValidation.hasNumber &&
    passwordValidation.hasMin8Length;
  const isPasswordConfirmValid =
    passwordConfirm.length > 0 && passwordConfirm === password;

  const isPasswordError = password.length > 0 && !isPasswordValid;
  const isPasswordConfirmError =
    passwordConfirm.length > 0 && !isPasswordConfirmValid;
  const isDisabled = !isPasswordConfirmValid || !isPasswordValid;

  const handleChangePassword = () => {};
  return (
    <View style={{ flex: 1 }}>
      <PasswordHeader />
      <View style={styles.container}>
        {isTempPassword && (
          <InputVerifyWidget
            placeholder="현재 비밀번호를 입력해주세요"
            value={currentPassword}
            onChangeText={(t) => setCurrentPassword(t)}
            isError={false}
            disabled={false}
          />
        )}
        <View>
          <InputVerifyWidget
            placeholder="새 비밀번호를 입력해주세요"
            value={password}
            isError={isPasswordError}
            onChangeText={(nextPassword) => {
              setPassword(nextPassword);
              setPasswordConfirm('');
            }}
          />
          <View style={styles.errorConditionContainer}>
            <CheckBox
              isActive={passwordValidation.hasEnglish}
              label="영문포함"
            />
            <CheckBox
              isActive={passwordValidation.hasNumber}
              label="숫자포함"
            />
            <CheckBox
              isActive={passwordValidation.hasMin8Length}
              label="8자 이상"
            />
          </View>
          <InputVerifyWidget
            placeholder="새 비밀번호를 다시 입력해주세요"
            value={passwordConfirm}
            disabled={!isPasswordValid}
            isError={isPasswordConfirmError}
            onChangeText={setPasswordConfirm}
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
      </View>
      <ChangeButton disabled={isDisabled} onPress={handleChangePassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpaicng14,
    paddingHorizontal: spacingSpacing16,
    gap: spacingSpacing16,
  },
  errorConditionContainer: {
    flexDirection: 'row',
    gap: spacingSpacing12,
    marginTop: spacingSpacing8,
    marginBottom: spacingSpacing12,
  },
});
