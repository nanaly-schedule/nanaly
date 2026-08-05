import {
  GestureResponderEvent,
  type StyleProp,
  ViewStyle,
} from 'react-native';

import CtaButton from '@/src/shared/ui/CtaButton';

interface VerifyButtonProps {
  isVerifyDisabled: boolean;
  onVerify: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export default function VerifyButton({
  isVerifyDisabled,
  onVerify,
  style,
}: VerifyButtonProps) {
  return (
    <CtaButton
      disabled={isVerifyDisabled}
      style={style}
      onPress={onVerify}
    >
      <CtaButton.Text>인증하기</CtaButton.Text>
    </CtaButton>
  );
}
