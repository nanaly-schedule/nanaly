import { Pressable, StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  basicColorBlue100,
  basicColorBlue700,
  basicColorGrey200,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing8,
  spacingSpacing30,
  typoColorPrimary,
  typoColorRed,
} from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

import InputLabel from '../../shared/InputLabel';
import { EmailVerifyStatus } from '../sign-up/EmailVerifyWidget';

interface SendEmailWidgetProps {
  email: string;
  status: EmailVerifyStatus;
  emailErrorMessage?: string;
  isEmailValid: boolean;
  onEmailChange: (email: string) => void;
  onSendPassword: () => void;
}

export default function SendEmailWidget({
  email,

  status,
  emailErrorMessage = '',
  isEmailValid,
  onEmailChange,
  onSendPassword,
}: SendEmailWidgetProps) {
  const isEmailEmpty = email.length === 0;
  const isVerified = status === EmailVerifyStatus.Sent;
  const hasEmailError = emailErrorMessage.length > 0;
  const isSendDisabled = !isEmailValid || isVerified;
  const emailButtonLabel = !isVerified ? '발송' : '발송됨';
  return (
    <View style={styles.content}>
      <NText
        variant="m16"
        style={{ color: typoColorPrimary, marginBottom: spacingSpacing30 }}
      >
        가입하신 이메일로 임시 비밀번호를 보내드립니다.
      </NText>
      <InputLabel label="이메일" />
      <View style={styles.inputContainer}>
        <Input
          variant={
            hasEmailError || (!isEmailEmpty && !isEmailValid) ? 'error' : ''
          }
          placeholder="example@email.com"
          style={{ flex: 1 }}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={onEmailChange}
        />
        <Pressable
          disabled={isSendDisabled}
          style={[
            styles.emailBtn,
            {
              backgroundColor:
                isSendDisabled && status !== EmailVerifyStatus.Sent
                  ? basicColorGrey200
                  : status === EmailVerifyStatus.Idle
                    ? buttonColorCta
                    : basicColorBlue100,
            },
          ]}
          onPress={onSendPassword}
        >
          <NText
            variant="m14"
            style={{
              color:
                status === EmailVerifyStatus.Idle
                  ? backgroundColorWhite
                  : basicColorBlue700,
            }}
          >
            {emailButtonLabel}
          </NText>
        </Pressable>
      </View>
      {hasEmailError ? (
        <NText
          variant="m12"
          style={{ color: typoColorRed, marginTop: spacingSpacing8 }}
        >
          {emailErrorMessage}
        </NText>
      ) : !isEmailEmpty && !isEmailValid ? (
        <NText
          variant="m12"
          style={{ color: typoColorRed, marginTop: spacingSpacing8 }}
        >
          올바른 이메일 주소를 입력해 주세요
        </NText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 14,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: spacingSpacing8,
  },
  emailBtn: {
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: 56,
  },
  verifyBtn: {
    marginTop: 20,
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
