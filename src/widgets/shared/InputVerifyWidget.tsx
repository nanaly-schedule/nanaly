import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { spacingSpacing8, typoColorPrimary } from '@/src/init/styles/tokens';
import EyeOffIcon from '@/src/shared/assets/EyeOffIcon';
import EyeOnIcon from '@/src/shared/assets/EyeOnIcon';
import XIcon from '@/src/shared/assets/XIcon';
import Input from '@/src/shared/ui/Input';

interface InputVerifyWidgetProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isError?: boolean;
  disabled?: boolean;
}

export default function InputVerifyWidget({
  placeholder,
  value,
  onChangeText,
  isError = false,
  disabled = false,
}: InputVerifyWidgetProps) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowIcon, setIsShowIcon] = useState(false);
  const handleFocus = () => {
    setIsShowIcon(true);
  };
  const handleBlur = () => {
    setIsShowIcon(false);
  };
  return (
    <View style={styles.inputContainer}>
      <Input
        variant={disabled ? 'disabled' : isError ? 'error' : ''}
        placeholder={placeholder}
        secureTextEntry={!isShowPassword}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isShowIcon && (
        <View style={styles.iconContainer}>
          <Pressable disabled={disabled} onPress={() => onChangeText('')}>
            <XIcon size={24} color={typoColorPrimary} />
          </Pressable>
          <Pressable
            disabled={disabled}
            onPress={() => setIsShowPassword((prev) => !prev)}
          >
            {isShowPassword ? (
              <EyeOnIcon size={24} color={typoColorPrimary} />
            ) : (
              <EyeOffIcon size={24} color={typoColorPrimary} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    flexDirection: 'row',
    right: 10,
    top: 13,
    gap: spacingSpacing8,
  },
});
