import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import {
  backgroundColorRed,
  backgroundColorWhite,
  borderDividerPrimary,
  radiusRadius8,
  typoColorPlaceholder,
  typoColorPrimary,
  typoColorRed,
} from '@/src/init/styles/tokens';

interface InputProps extends TextInputProps {
  variant: 'disabled' | '' | 'error';
}

const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    variant,
    editable = true,
    focusable = true,
    placeholderTextColor = typoColorPlaceholder,
    selectTextOnFocus,
    style,
    ...props
  },
  ref,
) {
  const isDisabled = variant === 'disabled';

  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        styles.container,
        isDisabled
          ? styles.disabled
          : variant === 'error'
            ? styles.error
            : styles.input,
        {
          fontFamily: 'Pretendard',
          fontWeight: '500',
          fontSize: 14,
          lineHeight: 16,
        },
        style,
      ]}
      editable={!isDisabled && editable}
      focusable={!isDisabled && focusable}
      selectTextOnFocus={isDisabled ? false : selectTextOnFocus}
      placeholderTextColor={placeholderTextColor}
    />
  );
});

export default Input;

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColorWhite,
    paddingHorizontal: 8,
    borderRadius: radiusRadius8,
    borderColor: backgroundColorWhite,
    borderWidth: 1,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: typoColorPrimary,
  },
  disabled: {
    backgroundColor: borderDividerPrimary,
    borderColor: borderDividerPrimary,
  },
  error: {
    backgroundColor: backgroundColorRed,
    borderColor: typoColorRed,
  },
});
