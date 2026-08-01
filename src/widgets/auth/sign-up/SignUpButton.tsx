import { GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CtaButton from '@/src/shared/ui/CtaButton';

interface SignUpButtonProps {
  disabled: boolean;
  onPress: (e: GestureResponderEvent) => void;
}

export default function SignUpButton({ disabled, onPress }: SignUpButtonProps) {
  const insets = useSafeAreaInsets();
  return (
    <CtaButton
      disabled={disabled}
      style={{ marginTop: 'auto', marginBottom: insets.bottom + 12 }}
      onPress={onPress}
    >
      <CtaButton.Text>가입하기</CtaButton.Text>
    </CtaButton>
  );
}
