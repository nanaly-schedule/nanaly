import {
  basicColorGrey800,
  typoColorPrimary,
  typoColorSub1,
} from '@/src/init/styles/tokens';
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
      <View>
        <View>
          {/* 로고 */}
          <Image src="" />
          <NText variant="h1" style={{ color: basicColorGrey800 }}>
            나날이
          </NText>
          <NText variant="m14" style={{ color: basicColorGrey800 }}>
            우리 가게 스케줄 관리
          </NText>
        </View>
        <View>
          <Input placeholder="아이디를 입력해주세요" variant="" />
          <Input
            placeholder="비밀번호를 입력해주세요"
            variant=""
            textContentType="password"
            secureTextEntry
          />
          <Pressable>
            <NText variant="m16" style={{ color: typoColorPrimary }}>
              로그인
            </NText>
          </Pressable>
          <View>
            <NText variant="m12" style={{ color: typoColorPrimary }}>
              비밀번호 재설정
            </NText>
            <NText variant="m12" style={{ color: typoColorPrimary }}>
              회원가입
            </NText>
          </View>
        </View>
        <View>
          <NText variant="m12" style={{ color: typoColorSub1 }}>
            또는
          </NText>
        </View>
        <View>
          <Pressable>
            <Text>구글</Text>
          </Pressable>
          <Pressable>
            <Text>애플</Text>
          </Pressable>
        </View>
      </View>
    </Main>
  );
}

const styles = StyleSheet.create({ main: {} });
