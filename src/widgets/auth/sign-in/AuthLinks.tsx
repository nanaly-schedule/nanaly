import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  borderDividerPrimary,
  spacingSpacing8,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

export default function AuthLinks() {
  const router = useRouter();
  return (
    <View style={styles.link}>
      <Pressable onPress={() => router.push('/auth/password')}>
        <NText variant="m12" style={styles.text}>
          비밀번호 재설정
        </NText>
      </Pressable>
      <View style={styles.verticalBorder} />
      <Pressable onPress={() => router.push('/auth/signup')}>
        <NText variant="m12" style={styles.text}>
          회원가입
        </NText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    gap: spacingSpacing8,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  text: {
    color: typoColorPrimary,
    paddingHorizontal: 12,
    paddingVertical: 15,
  },
  verticalBorder: {
    backgroundColor: borderDividerPrimary,
    width: 1,
    height: 12,
  },
});
