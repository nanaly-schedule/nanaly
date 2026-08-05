import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { isAxiosError } from 'axios';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { appleLogin, googleLogin, signIn } from '@/src/features/auth/api/sign';
import {
  saveAccessToken,
  saveRefreshToken,
} from '@/src/features/auth/lib/storage';
import { replaceToInitialRoute } from '@/src/features/store/lib/replaceToInitialRoute';
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

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  isTempPassword: boolean;
  isProfileComplete: boolean;
  name?: string | null;
  birthDate?: string | null;
}

export default function SignInPage() {
  const router = useRouter();
  const [, setIsSignInButtonPressed] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [isLoginErrorModalVisible, setIsLoginErrorModalVisible] =
    useState(false);
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

  const handleSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    if (!email || !password) {
      setLoginErrorMessage('이메일 또는 비밀번호를 입력해주세요');
      setIsLoginErrorModalVisible(true);
      return;
    }
    try {
      const response = await signIn({
        email,
        password,
      });
      const tokenPayload = response.data as AuthResponse;
      const { accessToken } = tokenPayload;
      const { refreshToken } = tokenPayload;
      if (!accessToken || !refreshToken) {
        throw new Error('토큰 정보가 없습니다');
      }
      // const { isTempPassword } = tokenPayload;
      // if (isTempPassword) {
      //   router.replace('/0/my/password');
      //   return;
      // }
      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken);

      await replaceToInitialRoute(router);
    } catch (error) {
      const statusCode = isAxiosError(error)
        ? error.response?.status
        : undefined;
      // const errorMessage = isAxiosError(error)
      //   ? typeof error.response?.data === 'string'
      //     ? error.response.data
      //     : (error.response?.data as { message?: string } | undefined)?.message
      //   : undefined;
      setLoginErrorMessage((prev) =>
        statusCode === 401
          ? '이메일 또는 비밀번호를 확인해주세요'
          : '로그인 중 오류가 발생했습니다',
      );
      setIsLoginErrorModalVisible((prev) => true);
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: googleWebClientId,
      iosClientId: googleIosClientId,
    });
  }, [googleIosClientId, googleWebClientId]);

  const shouldRedirectToAuthInfo = ({
    isProfileComplete,
    name,
    birthDate,
  }: AuthResponse) => {
    const hasEmptyName = typeof name === 'string' && name.trim().length === 0;
    const hasEmptyBirthDate =
      typeof birthDate === 'string' && birthDate.trim().length === 0;

    // return true;
    return !isProfileComplete || hasEmptyName || hasEmptyBirthDate;
  };

  const handlePressGoogleLoginButton = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleTokens = await GoogleSignin.getTokens();
      const idToken = userInfo.data?.idToken ?? googleTokens.idToken ?? null;
      const { accessToken } = googleTokens;

      const response = await googleLogin({ idToken, accessToken });

      const tokenPayload = response.data as AuthResponse;
      const savedAccessToken = tokenPayload.accessToken;
      const { refreshToken } = tokenPayload;

      if (!savedAccessToken || !refreshToken) {
        throw new Error('토큰 정보가 없습니다');
      }

      await saveAccessToken(savedAccessToken);
      await saveRefreshToken(refreshToken);
      if (shouldRedirectToAuthInfo(tokenPayload)) {
        router.replace('/auth/info');
        return;
      }

      await replaceToInitialRoute(router);
    } catch (error) {
      const statusCode = isAxiosError(error)
        ? error.response?.status
        : undefined;

      setLoginErrorMessage(
        statusCode === 401
          ? '구글 인증 정보가 만료되었습니다. 다시 시도해주세요'
          : '구글 로그인 중 오류가 발생했습니다',
      );
      setIsLoginErrorModalVisible(true);
    }
  };

  const handlePressAppleLoginButton = async () => {
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('잠시 후 다시 시도해주세요');
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken, fullName } = credential;

      if (!identityToken) {
        throw new Error('토큰 정보가 없습니다');
      }
      const name = fullName
        ? `${fullName.givenName ?? ''} ${fullName.familyName ?? ''}`.trim()
        : '';

      const response = await appleLogin({ identityToken, name });

      const tokenPayload = response.data as AuthResponse;
      const savedAccessToken = tokenPayload.accessToken;
      const { refreshToken } = tokenPayload;

      if (!savedAccessToken || !refreshToken) {
        throw new Error('토큰 정보가 없습니다');
      }

      await saveAccessToken(savedAccessToken);
      await saveRefreshToken(refreshToken);
      if (shouldRedirectToAuthInfo(tokenPayload)) {
        router.replace('/auth/info');
        return;
      }

      await replaceToInitialRoute(router);
    } catch {
      // const errorMessage = isAxiosError(error)
      //   ? typeof error.response?.data === 'string'
      //     ? error.response.data
      //     : (error.response?.data as { message?: string } | undefined)?.message
      //   : error instanceof Error
      //     ? error.message
      //     : undefined;

      setLoginErrorMessage('애플 로그인 중 오류가 발생했습니다');
      setIsLoginErrorModalVisible(true);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Main>
        <View style={styles.main}>
          <Logo color={basicColorGrey800} />
          <SignInForm
            onPressStateChange={setIsSignInButtonPressed}
            onSubmit={handleSignIn}
          />
          <SocialLoginButtons
            onGoogle={handlePressGoogleLoginButton}
            onApple={handlePressAppleLoginButton}
          />
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 16,
    gap: 30,
    width: '100%',
  },
});
