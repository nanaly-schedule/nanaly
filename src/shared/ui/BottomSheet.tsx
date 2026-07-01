import { useEffect, useState } from 'react';
import {
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

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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
          <View style={[styles.sheet, style]}>
            {showHandle && <View style={[styles.handle, handleStyle]} />}
            {children}
          </View>
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
