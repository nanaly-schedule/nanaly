import { StyleSheet, View } from 'react-native';

import {
  borderDividerPrimary,
  spacingSpacing8,
  typoColorPrimary,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

export default function AuthLinks() {
  return (
    <View style={styles.link}>
      <NText variant="m12" style={styles.text}>
        비밀번호 재설정
      </NText>
      <View style={styles.verticalBorder} />
      <NText variant="m12" style={styles.text}>
        회원가입
      </NText>
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
