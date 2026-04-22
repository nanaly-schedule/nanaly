import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignInPage() {
  return (
    <View>
      <View style={styles.main}>
        <View>
          <Text>나날이</Text>
          <Text>우리 가게 스케줄 관리</Text>
        </View>
        <View>
          <TextInput placeholder="아이디를 입력해주세요" />
          <TextInput placeholder="비밀번호를 입력해주세요" />
          <Pressable>로그인</Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({ main: {} });
