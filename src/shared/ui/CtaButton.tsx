import { createContext, type ReactNode, useContext } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import {
  backgroundColorWhite,
  basicColorGrey200,
  buttonColorCta,
  radiusRadius8,
  typoColorPlaceholder,
} from '@/src/init/styles/tokens';

import NText from './NText';

interface CtaButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface CtaButtonTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

const CtaButtonContext = createContext({ disabled: false });

function CtaButtonRoot({
  children,
  disabled = false,
  style,
  ...props
}: CtaButtonProps) {
  const isDisabled = !!disabled;

  return (
    <CtaButtonContext.Provider value={{ disabled: isDisabled }}>
      <Pressable
        disabled={isDisabled}
        style={[
          styles.button,
          {
            backgroundColor: isDisabled ? basicColorGrey200 : buttonColorCta,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    </CtaButtonContext.Provider>
  );
}

function CtaButtonText({ children, style }: CtaButtonTextProps) {
  const { disabled } = useContext(CtaButtonContext);

  return (
    <NText
      variant="m16"
      style={[
        { color: disabled ? typoColorPlaceholder : backgroundColorWhite },
        style,
      ]}
    >
      {children}
    </NText>
  );
}

const CtaButton = Object.assign(CtaButtonRoot, {
  Text: CtaButtonText,
});

export default CtaButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: buttonColorCta,
    borderRadius: radiusRadius8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
});
