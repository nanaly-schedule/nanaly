import { Pressable, StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  basicColorBlue100,
  basicColorBlue700,
  basicColorGrey200,
  brandColorPrimary,
  buttonColorCta,
  radiusRadius8,
  spacingSpacing8,
  spacingSpacing12,
  spacingSpacing16,
  typoColorPrimary,
  typoColorRed,
} from '@/src/init/styles/tokens';
import Input from '@/src/shared/ui/Input';
import NText from '@/src/shared/ui/NText';

export enum EmailVerifyStatus {
  Idle = 'idle',
  Sent = 'sent',
  Verified = 'verified',
}

interface EmailVerifyWidgetProps {
  email: string;
  code: string;
  status: EmailVerifyStatus;
  timer: number;
  isEmailValid: boolean;
  isCodeValid: boolean;
  isSending?: boolean;
  isVerifying?: boolean;
  onEmailChange: (email: string) => void;
  onCodeChange: (code: string) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
}

export default function EmailVerifyWidget({
  email,
  code,
  status,
  timer,
  isEmailValid,
  isCodeValid,
  isSending = false,
  isVerifying = false,
  onEmailChange,
  onCodeChange,
  onSendCode,
  onVerifyCode,
}: EmailVerifyWidgetProps) {
  const isEmailEmpty = email.length === 0;
  const hasSentCode = status === EmailVerifyStatus.Sent;
  const isVerified = status === EmailVerifyStatus.Verified;
  const isSendDisabled = !isEmailValid || isSending || isVerified;
  const isVerifyDisabled = code.length === 0 || isVerifying || isVerified;
  const emailButtonLabel = isVerified
    ? '인증됨'
    : hasSentCode
      ? '발송됨'
      : '인증';

  return (
    <View style={styles.container}>
      {!isVerified && (
        <NText
          variant="h2"
          style={{ color: typoColorPrimary, marginBottom: 30 }}
        >
          이메일을 입력해주세요
        </NText>
      )}
      <NText
        variant="sb14"
        style={{ color: typoColorPrimary, marginBottom: 14 }}
      >
        이메일
      </NText>

      <View style={{ marginBottom: spacingSpacing12 }}>
        <View style={styles.inputContainer}>
          <Input
            variant={isEmailEmpty || isEmailValid ? '' : 'error'}
            placeholder="example@email.com"
            style={{ flex: 1 }}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={onEmailChange}
            editable={!isCodeValid}
          />
          <Pressable
            disabled={isSendDisabled}
            style={[
              styles.emailBtn,
              {
                backgroundColor:
                  isSendDisabled && status !== EmailVerifyStatus.Verified
                    ? basicColorGrey200
                    : status === EmailVerifyStatus.Idle
                      ? buttonColorCta
                      : basicColorBlue100,
              },
            ]}
            onPress={onSendCode}
          >
            <NText
              variant="m14"
              style={{
                color:
                  status === EmailVerifyStatus.Idle
                    ? backgroundColorWhite
                    : status === EmailVerifyStatus.Sent ||
                        status === EmailVerifyStatus.Verified
                      ? basicColorBlue700
                      : basicColorBlue100,
              }}
            >
              {emailButtonLabel}
            </NText>
          </Pressable>
        </View>
        {!isEmailEmpty && !isEmailValid && (
          <NText
            variant="m12"
            style={{ color: typoColorRed, marginTop: spacingSpacing8 }}
          >
            올바른 이메일 주소를 입력해 주세요
          </NText>
        )}
      </View>

      {hasSentCode && (
        <>
          <View>
            <View style={styles.inputContainer}>
              <Input
                variant={code.length === 0 || isCodeValid ? '' : 'error'}
                placeholder="인증번호를 입력해주세요"
                style={{ flex: 1 }}
                value={code}
                onChangeText={onCodeChange}
              />
              <Pressable style={styles.timerBtn}>
                <NText variant="m14" style={{ color: brandColorPrimary }}>
                  {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
                </NText>
              </Pressable>
            </View>
            {code.length > 0 && !isCodeValid && (
              <NText
                variant="m12"
                style={{ color: typoColorRed, marginTop: spacingSpacing8 }}
              >
                코드를 다시 확인해 주세요
              </NText>
            )}
          </View>
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
              인증하기
            </NText>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 20,
    paddingHorizontal: spacingSpacing16,
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
  timerBtn: {
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
