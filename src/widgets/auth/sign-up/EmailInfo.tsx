import { StyleSheet, View } from 'react-native';

import {
  backgroundColorWhite,
  basicColorBlackBase,
  radiusRadius8,
  spacingSpacing8,
  spacingSpaicng14,
} from '@/src/init/styles/tokens';
import AppleIcon from '@/src/shared/assets/AppleIcon';
import GoogleIcon from '@/src/shared/assets/GoogleIcon';
import NText from '@/src/shared/ui/NText';

import InputLabel from '../../shared/InputLabel';

interface EmailInfoProps {
  provider: 'google' | 'apple' | null;
  email: string;
}

//TODO: ios에서 애플 아이콘 디자인 확인하기

export default function EmailInfo({ provider, email }: EmailInfoProps) {
  return (
    <View style={styles.container}>
      <InputLabel label="이메일" />
      <View style={styles.emailContainer}>
        {provider && provider === 'google' ? (
          <View style={[styles.icon, styles.googleIcon]}>
            <GoogleIcon size={13} />
          </View>
        ) : provider === 'apple' ? (
          <View style={[styles.icon, styles.appleIcon]}>
            <AppleIcon size={10} />
          </View>
        ) : (
          <View />
        )}
        <NText variant="m14">{email}</NText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacingSpaicng14,
  },
  emailContainer: {
    borderRadius: radiusRadius8,
    backgroundColor: backgroundColorWhite,
    paddingHorizontal: spacingSpacing8,
    gap: spacingSpacing8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    backgroundColor: backgroundColorWhite,
  },
  appleIcon: { backgroundColor: basicColorBlackBase },
});
