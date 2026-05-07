import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {
  backgroundColorWhite,
  basicColorGrey200,
  buttonColorCta,
  radiusRadius8,
  typoColorPlaceholder,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

interface VerifyButtonProps {
  isVerifyDisabled: boolean;
  onVerify: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
}

export default function VerifyButton({
  isVerifyDisabled,
  onVerify,
  style,
}: VerifyButtonProps) {
  return (
    <Pressable
      disabled={isVerifyDisabled}
      style={[
        styles.verifyBtn,
        {
          backgroundColor: isVerifyDisabled
            ? basicColorGrey200
            : buttonColorCta,
        },
        style,
      ]}
      onPress={onVerify}
    >
      <NText
        variant="m16"
        style={{
          color: isVerifyDisabled ? typoColorPlaceholder : backgroundColorWhite,
        }}
      >
        인증하기
      </NText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  verifyBtn: {
    marginTop: 20,
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
});
