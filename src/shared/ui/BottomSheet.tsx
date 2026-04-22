import { Modal, Pressable, StyleSheet, View } from 'react-native';

import {
  backgroundColorPrimary,
  dimOverlayDefault,
  radiusRadius20,
} from '@/src/init/styles/tokens';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

interface BottomSheetProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
}

export default function BottomSheet({
  visible,
  children,
  onClose,
}: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: dimOverlayDefault,
    opacity: 0.2,
  },
  sheet: {
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
