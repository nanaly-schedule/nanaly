import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  backgroundColorWhite,
  basicColorGrey200,
  buttonColorCta,
  radiusRadius8,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface SignUpButtonProps {
  disabled: boolean;
  onPress: (e: GestureResponderEvent) => void;
}

export default function SignUpButton({ disabled, onPress }: SignUpButtonProps) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.verifyBtn,
        {
          backgroundColor: disabled ? basicColorGrey200 : buttonColorCta,
          marginBottom: insets.bottom + 12,
        },
      ]}
      onPress={onPress}
    >
      <NText variant="m16" style={{ color: backgroundColorWhite }}>
        가입하기
      </NText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  verifyBtn: {
    marginTop: 'auto',
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
