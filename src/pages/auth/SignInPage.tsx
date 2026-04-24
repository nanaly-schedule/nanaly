import { useState } from 'react';
import { useRouter } from 'expo-router';
import { isAxiosError } from 'axios';
import { StyleSheet, View } from 'react-native';

import { signIn } from '@/src/features/auth/api/sign';
import {
  saveAccessToken,
  saveRefreshToken,
} from '@/src/features/auth/lib/storage';
import { basicColorGrey800 } from '@/src/init/styles/tokens';
import BaseModal from '@/src/shared/ui/BaseModal';
import Main from '@/src/shared/ui/Main';
import SignInForm from '@/src/widgets/auth/sign-in/SignInForm';
import SocialLoginButtons from '@/src/widgets/auth/sign-in/SocialLoginButtons';
import Logo from '@/src/widgets/Logo';

/**
 * 기능:
 * -
 *
 * 이유:
 * -
 *
 * 상태 흐름:
 * -
 *
 * 실패 시나리오:
 * -
 *
 * 성능:
 * -
 *
 * 플랫폼 고려:
 * -
 *
 * 의존성:
 * -
 *
 * 트레이드오프:
 * -
 */

export default function SignInPage() {
  const router = useRouter();
  const [, setIsSignInButtonPressed] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [isLoginErrorModalVisible, setIsLoginErrorModalVisible] =
    useState(false);

  const handleSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    if (!email || !password) {
      return;
    }

    try {
      const response = await signIn({
        email: email.toLowerCase(),
        password,
      });
      const tokenPayload = response.data as {
        accessToken?: string;
        refreshToken?: string;
        data?: {
          accessToken?: string;
          refreshToken?: string;
        };
      };
      const accessToken =
        tokenPayload.accessToken ?? tokenPayload.data?.accessToken;
      const refreshToken =
        tokenPayload.refreshToken ?? tokenPayload.data?.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error('토큰 정보가 없습니다');
      }

      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken);
      router.replace('/');
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? typeof error.response?.data === 'string'
          ? error.response.data
          : (error.response?.data as { message?: string } | undefined)?.message
        : undefined;

      setLoginErrorMessage(errorMessage ?? '로그인 중 오류가 발생했습니다');
      setIsLoginErrorModalVisible(true);
    }
  };

  return (
    <Main>
      <View style={styles.main}>
        <Logo color={basicColorGrey800} />
        <SignInForm
          onPressStateChange={setIsSignInButtonPressed}
          onSubmit={handleSignIn}
        />
        <SocialLoginButtons />
      </View>
      <BaseModal
        visible={isLoginErrorModalVisible}
        onClose={() => setIsLoginErrorModalVisible(false)}
      >
        <BaseModal.Content>
          <BaseModal.Title>로그인 실패</BaseModal.Title>
          <BaseModal.Text>{loginErrorMessage}</BaseModal.Text>
        </BaseModal.Content>
        <BaseModal.Actions>
          <BaseModal.Button
            fullWidth
            onPress={() => setIsLoginErrorModalVisible(false)}
          >
            확인
          </BaseModal.Button>
        </BaseModal.Actions>
      </BaseModal>
    </Main>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 16,
    gap: 30,
    width: '100%',
  },
});
