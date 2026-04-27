import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  backgroundColorWhite,
  spacingSpacing16,
} from '@/src/init/styles/tokens';
import AppleIcon from '@/src/shared/assets/AppleIcon';
import GoogleIcon from '@/src/shared/assets/GoogleIcon';

interface SocialLoginButtonsProps {
  onGoogle: (e: GestureResponderEvent) => void;
  onApple: (e: GestureResponderEvent) => void;
}

export default function SocialLoginButtons({
  onGoogle,
  onApple,
}: SocialLoginButtonsProps) {
  return (
    <View style={styles.iconContainer}>
      <Pressable style={[styles.googleIcon, styles.icon]} onPress={onGoogle}>
        <GoogleIcon size={24} />
      </Pressable>
      <Pressable style={[styles.appleIcon, styles.icon]} onPress={onApple}>
        <AppleIcon size={21} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
