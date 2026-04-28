import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { isAxiosError } from 'axios';

import BirthDatePickerBottomSheet from '@/src/features/auth/ui/BirthDatePickerBottomSheet';
import ExistingEmailModal from '@/src/features/auth/ui/ExistingEmailModal';
import VerificationCodeResendModal from '@/src/features/auth/ui/VerificationCodeResendModal';
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
import { signUp } from '@/src/features/auth/api/sign';
import { sendCode, verifyCode } from '@/src/features/auth/api/verify';
import SignUpButton from '@/src/widgets/auth/sign-up/SignUpButton';

export default function AuthVerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailStatus, setEmailStatus] = useState<EmailVerifyStatus>(
    EmailVerifyStatus.Idle,
  );
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [codeErrorMessage, setCodeErrorMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [emailSendCount, setEmailSendCount] = useState(0);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<BirthDateValue | null>(null);
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);
  const [isSubmittingSignUp, setIsSubmittingSignUp] = useState(false);
  const [isExistingEmailModalVisible, setIsExistingEmailModalVisible] =
    useState(false);
  const [
    isVerificationCodeResendModalVisible,
    setIsVerificationCodeResendModalVisible,
  ] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();

  const handleVerifyCode = async () => {
    if (
      !isCodeValid ||
      !isPasswordValid ||
      !isPasswordConfirmValid ||
      !birthDate ||
      isSubmittingSignUp
    ) {
      return;
    }

    setIsSubmittingSignUp(true);
    try {
      await signUp({
        email: normalizedEmail,
        password,
        name: name.trim(),
        birthDate: `${birthDate.year}-${String(birthDate.month).padStart(2, '0')}-${String(
          birthDate.day,
        ).padStart(2, '0')}`,
      });

      router.replace('/');
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const errorMessage = isAxiosError(error)
        ? typeof error.response?.data === 'string'
          ? error.response.data
          : (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      const errorPayload = isAxiosError(error) ? error.response?.data : error;

      console.error('회원가입 실패:', errorPayload);
      if (status === 400) {
        setCode('');
        setIsCodeValid(false);
        setCodeErrorMessage('');
        setEmailStatus(EmailVerifyStatus.Idle);
        setEmailErrorMessage('이메일 인증이 필요합니다. 다시 인증해 주세요');
        setTimer(0);
      }

      Alert.alert(
        '회원가입 실패',
        status === 400
          ? (errorMessage ?? '이메일 인증이 필요합니다. 다시 인증해 주세요')
          : (errorMessage ?? '회원가입 중 오류가 발생했습니다'),
      );
    } finally {
      setIsSubmittingSignUp(false);
    }
  };
  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
    normalizedEmail,
  );
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
    !isPasswordConfirmValid ||
    !isPasswordValid ||
    !isAuthInfoValid ||
    isSubmittingSignUp;

  useEffect(() => {
    if (timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (
      emailStatus === EmailVerifyStatus.Sent &&
      timer === 0 &&
      emailSendCount > 0
    ) {
      setIsVerificationCodeResendModalVisible(true);
    }
  }, [emailSendCount, emailStatus, timer]);

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail);
    setCode('');
    setIsCodeValid(false);
    setCodeErrorMessage('');
    setEmailStatus(EmailVerifyStatus.Idle);
    setEmailErrorMessage('');
    setEmailSendCount(0);
    setTimer(0);
    setIsExistingEmailModalVisible(false);
    setIsVerificationCodeResendModalVisible(false);
  };

  const handleSendEmailCode = async () => {
    if (
      !isEmailValid ||
      isSendingEmailCode ||
      (emailStatus === EmailVerifyStatus.Sent && timer > 0)
    ) {
      return;
    }

    if (emailSendCount >= 3) {
      setEmailErrorMessage('인증 메일은 최대 3회까지 전송할 수 있습니다');
      return;
    }

    setIsSendingEmailCode(true);
    setCode('');
    setIsCodeValid(false);
    setCodeErrorMessage('');
    setEmailErrorMessage('');
    try {
      await sendCode({
        email: normalizedEmail,
      });

      setEmailStatus(EmailVerifyStatus.Sent);
      setEmailSendCount((prev) => prev + 1);
      setTimer(60);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setCode('');
        setEmailStatus(EmailVerifyStatus.Idle);
        setTimer(0);
        setEmailErrorMessage('');
        setIsExistingEmailModalVisible(true);
      }
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (code.length === 0 || isVerifyingEmailCode) {
      return;
    }

    setIsVerifyingEmailCode(true);
    setCodeErrorMessage('');
    try {
      await verifyCode({
        email: normalizedEmail,
        code,
      });

      setIsCodeValid(true);
      setCodeErrorMessage('');
      setEmailStatus(EmailVerifyStatus.Verified);
      setTimer(0);
    } catch (error) {
      setIsCodeValid(false);

      if (isAxiosError(error) && error.response?.status === 400) {
        setCodeErrorMessage('코드를 다시 확인해 주세요');
        setEmailStatus(EmailVerifyStatus.Sent);
        return;
      }

      console.error('이메일 인증 실패:', error);
    } finally {
      setIsVerifyingEmailCode(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AuthHeader />
      <EmailVerifyWidget
        email={email}
        code={code}
        status={emailStatus}
        emailErrorMessage={emailErrorMessage}
        codeErrorMessage={codeErrorMessage}
        timer={timer}
        isEmailValid={isEmailValid}
        isCodeValid={isCodeValid}
        isSending={isSendingEmailCode}
        isVerifying={isVerifyingEmailCode}
        onEmailChange={handleEmailChange}
        onCodeChange={(nextCode) => {
          setCode(nextCode);
          setCodeErrorMessage('');
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
        <SignUpButton disabled={isVerifyDisabled} onPress={handleVerifyCode} />
      )}
      <BirthDatePickerBottomSheet
        visible={isBirthDatePickerOpen}
        value={birthDate}
        onChange={setBirthDate}
        onClose={() => setIsBirthDatePickerOpen(false)}
      />
      <ExistingEmailModal
        visible={isExistingEmailModalVisible}
        onConfirm={() => setIsExistingEmailModalVisible(false)}
        onClose={() => setIsExistingEmailModalVisible(false)}
      />
      <VerificationCodeResendModal
        visible={isVerificationCodeResendModalVisible}
        resendCount={emailSendCount}
        onConfirm={() => setIsVerificationCodeResendModalVisible(false)}
        onClose={() => setIsVerificationCodeResendModalVisible(false)}
      />
    </View>
  );
}
