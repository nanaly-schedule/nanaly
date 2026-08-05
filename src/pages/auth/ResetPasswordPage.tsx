import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { resetPassword } from '@/src/features/auth/api/password';
import PageLayout from '@/src/shared/ui/PageLayout';
import SendEmailWidget from '@/src/widgets/auth/password/SendEmailWidget';
import { EmailVerifyStatus } from '@/src/widgets/auth/sign-up/EmailVerifyWidget';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<EmailVerifyStatus>(
    EmailVerifyStatus.Idle,
  );
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const normalizedEmail = email.trim();

  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
    normalizedEmail,
  );

  const router = useRouter();

  const completePasswordResetRequest = () => {
    setEmailStatus(EmailVerifyStatus.Sent);
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const handleSendPassword = async () => {
    try {
      if (!isEmailValid) {
        setEmailErrorMessage('유효하지 않은 이메일 입니다.');
        return;
      }
      setEmailErrorMessage('');
      await resetPassword({ email: normalizedEmail });
      completePasswordResetRequest();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status !== undefined) {
        if (error.response.status < 500) {
          completePasswordResetRequest();
          return;
        }
      }

      setEmailErrorMessage('메일 전송 중 오류가 발생했습니다.');
      setEmailStatus(EmailVerifyStatus.Idle);
    }
  };
  return (
    <PageLayout>
      <SendEmailWidget
        email={email}
        onEmailChange={(t) => setEmail(t)}
        status={emailStatus}
        isEmailValid={isEmailValid}
        emailErrorMessage={emailErrorMessage}
        onSendPassword={handleSendPassword}
      />
    </PageLayout>
  );
}
