import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import BirthDatePickerBottomSheet from '@/src/features/auth/ui/BirthDatePickerBottomSheet';
import {
  backgroundColorWhite,
  basicColorGrey200,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing16,
  spacingSpacing20,
} from '@/src/init/styles/tokens';
import { BirthDateValue, formatBirthDate } from '@/src/shared/lib/date';
import NText from '@/src/shared/ui/NText';
import AuthHeader from '@/src/widgets/auth/sign-up/AuthHeader';
import AuthInfo from '@/src/widgets/auth/sign-up/AuthInfo';
import EmailVerifyWidget, {
  EmailVerifyStatus,
} from '@/src/widgets/auth/sign-up/EmailVerifyWidget';
import PasswordVerifyWidget, {
  PasswordValidationState,
} from '@/src/widgets/auth/sign-up/PasswordVerifyWidget';

export default function AuthVerifyPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailStatus, setEmailStatus] = useState<EmailVerifyStatus>(
    EmailVerifyStatus.Idle,
  );
  const [timer, setTimer] = useState(0);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<BirthDateValue | null>(null);
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);

  const onVerifyCode = () => {
    // TODO: Implement the signup submit logic here.
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const birthDateText = birthDate ? formatBirthDate(birthDate) : '';
  const isAuthInfoValid = name.trim().length > 0 && birthDate !== null;
  const isVerifyDisabled =
    !isPasswordConfirmValid || !isPasswordValid || !isAuthInfoValid;

  useEffect(() => {
    if (timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail);
    setCode('');
    setEmailStatus(EmailVerifyStatus.Idle);
    setTimer(0);
  };

  const handleSendEmailCode = async () => {
    if (!isEmailValid || isSendingEmailCode) {
      return;
    }

    setIsSendingEmailCode(true);
    try {
      // TODO: replace with email verification code request API.
      setEmailStatus(EmailVerifyStatus.Sent);
      setTimer(180);
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (code.length === 0 || isVerifyingEmailCode) {
      return;
    }

    setIsVerifyingEmailCode(true);
    try {
      // TODO: replace with email verification code confirm API.
      const verified = true;
      setIsCodeValid(verified);
      if (verified) {
        setEmailStatus(EmailVerifyStatus.Verified);
        setTimer(0);
      }
    } finally {
      setIsVerifyingEmailCode(false);
    }
  };

  return (
    <View>
      <AuthHeader />
      <EmailVerifyWidget
        email={email}
        code={code}
        status={emailStatus}
        timer={timer}
        isEmailValid={isEmailValid}
        isCodeValid={isCodeValid}
        isSending={isSendingEmailCode}
        isVerifying={isVerifyingEmailCode}
        onEmailChange={handleEmailChange}
        onCodeChange={(nextCode) => {
          setCode(nextCode);
        }}
        onSendCode={handleSendEmailCode}
        onVerifyCode={handleVerifyEmailCode}
      />
      {isCodeValid && (
        <PasswordVerifyWidget
          password={password}
          passwordConfirm={passwordConfirm}
          validation={passwordValidation}
          isPasswordValid={isPasswordValid}
          isPasswordConfirmValid={isPasswordConfirmValid}
          onPasswordChange={(nextPassword) => {
            setPassword(nextPassword);
            setPasswordConfirm('');
          }}
          onPasswordConfirmChange={setPasswordConfirm}
        />
      )}
      {isPasswordConfirmValid && (
        <AuthInfo
          name={name}
          birthDate={birthDateText}
          onNameChange={setName}
          onBirthDateFocus={() => setIsBirthDatePickerOpen(true)}
        />
      )}
      {isPasswordConfirmValid && (
        <Pressable
          disabled={isVerifyDisabled}
          style={[
            styles.verifyBtn,
            {
              backgroundColor: isVerifyDisabled
                ? basicColorGrey200
                : buttonColorCta,
            },
          ]}
          onPress={onVerifyCode}
        >
          <NText variant="m16" style={{ color: backgroundColorWhite }}>
            확인
          </NText>
        </Pressable>
      )}
      <BirthDatePickerBottomSheet
        visible={isBirthDatePickerOpen}
        value={birthDate}
        onChange={setBirthDate}
        onClose={() => setIsBirthDatePickerOpen(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  verifyBtn: {
    marginHorizontal: spacingSpacing16,
    marginTop: spacingSpacing20,
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
