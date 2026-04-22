import Input from '@/src/shared/ui/Input';
import Main from '@/src/shared/ui/Main';
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
          <Text>나날이</Text>
          <Text>우리 가게 스케줄 관리</Text>
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
            <Text>로그인</Text>
          </Pressable>
          <View>
            <Text>비밀번호 재설정</Text>
            <Text>회원가입</Text>
          </View>
        </View>
        <View>
          <Text>또는</Text>
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
