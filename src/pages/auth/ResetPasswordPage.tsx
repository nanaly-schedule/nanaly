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

  const normalizedEmail = email.trim().toLowerCase();

  const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
    normalizedEmail,
  );

  const router = useRouter();

  const handleSendPassword = async () => {
    try {
      if (!isEmailValid) {
        setEmailErrorMessage('유효하지 않은 이메일 입니다.');
        return;
      }
      await resetPassword({ email: normalizedEmail });
      setEmailStatus(EmailVerifyStatus.Sent);
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.error(error);
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
