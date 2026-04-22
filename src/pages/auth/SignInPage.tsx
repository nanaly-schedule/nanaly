import {
  backgroundColorPrimary,
  backgroundColorWhite,
  basicColorGrey800,
  borderDividerPrimary,
  brandColorPrimary,
  brandColorSecondary,
  radiusRadius12,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing8,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import AppIcon from '@/src/shared/assets/AppIcon';
import AppleIcon from '@/src/shared/assets/AppleIcon';
import GoogleIcon from '@/src/shared/assets/GoogleIcon';
import Input from '@/src/shared/ui/Input';
import Main from '@/src/shared/ui/Main';
import NText from '@/src/shared/ui/NText';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
        <View style={styles.logo}>
          <AppIcon size={72} color={basicColorGrey800} />
          <NText
            variant="h1"
            style={{ color: basicColorGrey800, marginTop: 2 }}
          >
            나날이
          </NText>
          <NText variant="m14" style={{ color: basicColorGrey800 }}>
            우리 가게 스케줄 관리
          </NText>
        </View>
        <View>
          <View style={styles.input}>
            <Input placeholder="아이디를 입력해주세요" variant="" />
            <Input
              placeholder="비밀번호를 입력해주세요"
              variant=""
              textContentType="password"
              secureTextEntry
            />
          </View>
          <Pressable style={styles.cta}>
            <NText variant="m16" style={{ color: backgroundColorPrimary }}>
              로그인
            </NText>
          </Pressable>
          <View style={styles.link}>
            <NText
              variant="m12"
              style={{
                color: typoColorPrimary,
                paddingHorizontal: 12,
                paddingVertical: 15,
              }}
            >
              비밀번호 재설정
            </NText>
            <View style={styles.verticalBorder} />
            <NText
              variant="m12"
              style={{
                color: typoColorPrimary,
                paddingHorizontal: 12,
                paddingVertical: 15,
              }}
            >
              회원가입
            </NText>
          </View>
          <View style={styles.divider}>
            <View style={styles.border} />
            <NText variant="m12" style={{ color: typoColorSub1 }}>
              또는
            </NText>
            <View style={styles.border} />
          </View>
        </View>

        <View style={styles.iconContainer}>
          <Pressable style={[styles.googleIcon, styles.icon]}>
            <GoogleIcon size={24} />
          </Pressable>
          <Pressable style={[styles.appleIcon, styles.icon]}>
            <AppleIcon size={21} />
          </Pressable>
        </View>
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
  logo: {
    gap: spacingSpacing8,
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  input: {
    gap: spacingSpacing12,
    marginBottom: spacingSpacing16,
  },
  cta: {
    borderRadius: radiusRadius12,
    height: 46,
    backgroundColor: brandColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    gap: spacingSpacing8,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    flexShrink: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: spacingSpacing8,
  },
  verticalBorder: {
    backgroundColor: borderDividerPrimary,
    width: 1,
    height: 12,
  },
  border: {
    backgroundColor: borderDividerPrimary,
    height: 1,
    flex: 1,
  },
  iconContainer: {
    margin: 'auto',
    flexDirection: 'row',
    gap: spacingSpacing16,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    backgroundColor: backgroundColorWhite,
  },
  appleIcon: {
    backgroundColor: '#000000',
  },
});
