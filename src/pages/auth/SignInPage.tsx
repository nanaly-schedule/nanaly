import { StyleSheet, View } from 'react-native';

import { basicColorGrey800 } from '@/src/init/styles/tokens';
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
  return (
    <Main>
      <View style={styles.main}>
        <Logo color={basicColorGrey800} />
        <SignInForm />
        <SocialLoginButtons />
      </View>
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
