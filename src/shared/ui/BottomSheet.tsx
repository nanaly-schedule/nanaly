import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {
  backgroundColorPrimary,
  dimOverlayDefault,
  radiusRadius20,
} from '@/src/init/styles/tokens';

interface BottomSheetProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
  showHandle?: boolean;
  handleStyle?: StyleProp<ViewStyle>;
}

export default function BottomSheet({
  visible,
  children,
  onClose,
  style,
  showHandle = true,
  handleStyle,
}: BottomSheetProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const sheetProgress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    sheetProgress.setValue(1);
    Animated.timing(sheetProgress, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [sheetProgress, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          style={[
            styles.sheetContainer,
            Platform.OS === 'android' && { paddingBottom: keyboardHeight },
          ]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animated.View
            style={[
              styles.animatedSheet,
              {
                transform: [
                  {
                    translateY: sheetProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 640],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[styles.sheet, style]}>
              {showHandle && <View style={[styles.handle, handleStyle]} />}
              {children}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  animatedSheet: {
    width: '100%',
    maxHeight: '100%',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: dimOverlayDefault,
    opacity: 0.2,
  },
  sheet: {
    minHeight: 360,
    backgroundColor: backgroundColorPrimary,
    borderTopLeftRadius: radiusRadius20,
    borderTopRightRadius: radiusRadius20,
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 32,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 9999,
    backgroundColor: '#8D8D8D',
    marginBottom: 20,
  },
});
