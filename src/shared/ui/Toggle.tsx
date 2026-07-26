import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {
  backgroundColorWhite,
  basicColorBlue600,
  basicColorGrey200,
  basicColorGrey300,
} from '@/src/init/styles/tokens';

interface ToggleProps extends Omit<
  PressableProps,
  'onPress' | 'style' | 'children'
> {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 20;
const PADDING = 2;
const TRANSLATE_X = TRACK_WIDTH - THUMB_SIZE - PADDING * 2;

export default function Toggle({
  value,
  onValueChange,
  disabled = false,
  style,
  ...props
}: ToggleProps) {
  const translateX = useRef(
    new Animated.Value(value ? TRANSLATE_X : 0),
  ).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? TRANSLATE_X : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [translateX, value]);

  return (
    <Pressable
      {...props}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      style={[
        styles.container,
        value ? styles.containerActive : styles.containerInactive,
        disabled && styles.containerDisabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: PADDING,
    justifyContent: 'center',
  },
  containerActive: {
    backgroundColor: basicColorBlue600,
  },
  containerInactive: {
    backgroundColor: basicColorGrey200,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: backgroundColorWhite,
  },
});
