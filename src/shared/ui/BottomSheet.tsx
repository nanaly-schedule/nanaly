import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

import {
  backgroundColorPrimary,
  dimOverlayDefault,
  radiusRadius20,
} from '@/src/init/styles/tokens';

interface BottomSheetProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
}

export default function BottomSheet({
  visible,
  children,
  onClose,
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
          <View style={styles.sheet}>
            <View style={styles.handle} />
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
    width: 80,
    height: 8,
    borderRadius: 9999,
    backgroundColor: '#8D8D8D',
    marginBottom: 28,
  },
});
