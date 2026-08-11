import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { signUp } from '@/src/features/auth/api/sign';
import { sendCode, verifyCode } from '@/src/features/auth/api/verify';
import { VerifyCodeErrorDetails } from '@/src/features/auth/model/verify';
import BirthDatePickerBottomSheet from '@/src/features/auth/ui/BirthDatePickerBottomSheet';
import EmailVerificationLimitExceededModal from '@/src/features/auth/ui/EmailVerificationLimitExceededModal';
import ExistingEmailModal from '@/src/features/auth/ui/ExistingEmailModal';
import VerificationCodeResendModal from '@/src/features/auth/ui/VerificationCodeResendModal';
import { replaceToInitialRoute } from '@/src/features/store/lib/replaceToInitialRoute';
import { BirthDateValue, formatBirthDate } from '@/src/shared/lib/date';
import PageLayout from '@/src/shared/ui/PageLayout';
import AuthInfo from '@/src/widgets/auth/sign-up/AuthInfo';
import EmailVerifyWidget, {
  EmailVerifyStatus,
} from '@/src/widgets/auth/sign-up/EmailVerifyWidget';
import PasswordVerifyWidget, {
  PasswordValidationState,
} from '@/src/widgets/auth/sign-up/PasswordVerifyWidget';
import SignUpButton from '@/src/widgets/auth/sign-up/SignUpButton';

const VERIFICATION_CODE_TTL_SECONDS = 180;

function getRemainingVerificationSeconds(expiresAt: number) {
  return Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0);
}

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
  const [verificationCodeExpiresAt, setVerificationCodeExpiresAt] = useState<
    number | null
  >(null);
  const [emailSendCount, setEmailSendCount] = useState(0);
  const [remainingResendAttempts, setRemainingResendAttempts] = useState(3);
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
    isEmailVerificationLimitExceededModalVisible,
    setIsEmailVerificationLimitExceededModalVisible,
  ] = useState(false);
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
        birthDate: birthDate ? formatBirthDate(birthDate) : null,
      });

      await replaceToInitialRoute(router);
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;

      if (status === 400) {
        setCode('');
        setIsCodeValid(false);
        setCodeErrorMessage('');
        setEmailStatus(EmailVerifyStatus.Idle);
        setEmailErrorMessage('이메일 인증이 필요합니다. 다시 인증해 주세요');
        setTimer(0);
        setVerificationCodeExpiresAt(null);
      }

      if (status === 409) {
        setIsExistingEmailModalVisible(true);
      }
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
  const isAuthInfoValid = name.trim().length > 0;
  const isVerifyDisabled =
    !isPasswordConfirmValid ||
    !isPasswordValid ||
    !isAuthInfoValid ||
    isSubmittingSignUp;

  useEffect(() => {
    if (
      emailStatus !== EmailVerifyStatus.Sent ||
      verificationCodeExpiresAt === null
    ) {
      setTimer(0);
      return;
    }

    const updateRemainingTime = () => {
      setTimer(getRemainingVerificationSeconds(verificationCodeExpiresAt));
    };

    updateRemainingTime();

    const interval = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        updateRemainingTime();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [emailStatus, verificationCodeExpiresAt]);

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
    setRemainingResendAttempts(3);
    setTimer(0);
    setVerificationCodeExpiresAt(null);
    setIsExistingEmailModalVisible(false);
    setIsEmailVerificationLimitExceededModalVisible(false);
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
      const nextExpiresAt = Date.now() + VERIFICATION_CODE_TTL_SECONDS * 1000;
      setVerificationCodeExpiresAt(nextExpiresAt);
      setTimer(getRemainingVerificationSeconds(nextExpiresAt));
      setEmailSendCount((prev) => {
        const nextCount = prev + 1;
        setRemainingResendAttempts(Math.max(3 - nextCount, 0));
        return nextCount;
      });
    } catch (error) {
      if (!isAxiosError(error)) {
        return;
      }

      if (error.response?.status === 409) {
        setCode('');
        setEmailStatus(EmailVerifyStatus.Idle);
        setTimer(0);
        setVerificationCodeExpiresAt(null);
        setEmailErrorMessage('');
        setIsExistingEmailModalVisible(true);
        return;
      }

      if (error.response?.status === 429) {
        setCode('');
        setEmailStatus(EmailVerifyStatus.Idle);
        setTimer(0);
        setVerificationCodeExpiresAt(null);
        setEmailErrorMessage('');
        setIsEmailVerificationLimitExceededModalVisible(true);
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
      setVerificationCodeExpiresAt(null);
    } catch (error) {
      setIsCodeValid(false);

      if (!isAxiosError(error)) {
        return;
      }

      const details = error.response?.data as
        | { details?: VerifyCodeErrorDetails }
        | undefined;
      const serverRemainingAttempts = details?.details?.remainingAttempts;

      if (typeof serverRemainingAttempts === 'number') {
        setRemainingResendAttempts(serverRemainingAttempts);
        setCode('');
        setCodeErrorMessage('');
        setEmailStatus(EmailVerifyStatus.Sent);
        setTimer(0);
        setVerificationCodeExpiresAt(null);
        setIsVerificationCodeResendModalVisible(true);
        return;
      }

      if (error.response?.status === 400) {
        setCodeErrorMessage('코드를 다시 확인해 주세요');
        setEmailStatus(EmailVerifyStatus.Sent);
      }
    } finally {
      setIsVerifyingEmailCode(false);
    }
  };

  return (
    <PageLayout title="회원가입">
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
      <EmailVerificationLimitExceededModal
        visible={isEmailVerificationLimitExceededModalVisible}
        onConfirm={() => setIsEmailVerificationLimitExceededModalVisible(false)}
        onClose={() => setIsEmailVerificationLimitExceededModalVisible(false)}
      />
      <VerificationCodeResendModal
        visible={isVerificationCodeResendModalVisible}
        remainingAttempts={remainingResendAttempts}
        onConfirm={() => setIsVerificationCodeResendModalVisible(false)}
        onClose={() => setIsVerificationCodeResendModalVisible(false)}
      />
    </PageLayout>
  );
}
