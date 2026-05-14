import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

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

export default function Input({
  variant,
  editable = true,
  focusable = true,
  selectTextOnFocus,
  style,
  ...props
}: InputProps) {
  const isDisabled = variant === 'disabled';

  return (
    <TextInput
      {...props}
      style={[
        styles.container,
        isDisabled
          ? styles.disabled
          : variant === 'error'
            ? styles.error
            : styles.input,
        style,
      ]}
      editable={!isDisabled && editable}
      focusable={!isDisabled && focusable}
      selectTextOnFocus={isDisabled ? false : selectTextOnFocus}
      placeholderTextColor={typoColorPlaceholder}
    />
  );
}

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
