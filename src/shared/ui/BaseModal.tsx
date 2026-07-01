import { ReactNode } from 'react';
import {
  Modal,
  ModalProps,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';

import {
  backgroundColorWhite,
  buttonColorCta,
  buttonColorSecondary,
  dimOverlayDefault,
  radiusRadius8,
  radiusRadius16,
  spacingSpacing12,
  spacingSpacing16,
  spacingSpacing20,
  spacingSpacing24,
  typoColorPrimary,
} from '@/src/init/styles/tokens';

import NText from './NText';

interface BaseModalRootProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdropPress?: boolean;
  animationType?: ModalProps['animationType'];
}

interface BaseModalSectionProps extends ViewProps {
  children: ReactNode;
}

interface BaseModalTextProps {
  children: ReactNode;
}

interface BaseModalActionsProps extends ViewProps {
  children: ReactNode;
}

interface BaseModalButtonProps extends PressableProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

function BaseModalRoot({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
  animationType = 'fade',
}: BaseModalRootProps) {
  if (!visible) {
    return null;
  }

  const handleBackdropPress = () => {
    if (!closeOnBackdropPress) {
      return;
    }

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
        <View style={styles.card}>{children}</View>
      </View>
    </Modal>
  );
}

function BaseModalContent({
  children,
  style,
  ...props
}: BaseModalSectionProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

function BaseModalTitle({ children }: BaseModalTextProps) {
  return (
    <NText variant="b16" style={styles.title}>
      {children}
    </NText>
  );
}

function BaseModalText({ children }: BaseModalTextProps) {
  return (
    <NText variant="b14" style={styles.text}>
      {children}
    </NText>
  );
}

function BaseModalActions({
  children,
  style,
  ...props
}: BaseModalActionsProps) {
  return (
    <View style={[styles.buttonRow, style]} {...props}>
      {children}
    </View>
  );
}

function BaseModalButton({
  children,
  variant = 'primary',
  fullWidth = false,
  ...props
}: BaseModalButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        fullWidth && styles.fullWidthButton,
      ]}
      {...props}
    >
      <NText
        variant="m14"
        style={
          variant === 'primary'
            ? styles.primaryButtonText
            : styles.secondaryButtonText
        }
      >
        {children}
      </NText>
    </Pressable>
  );
}

type BaseModalCompound = typeof BaseModalRoot & {
  Content: typeof BaseModalContent;
  Title: typeof BaseModalTitle;
  Text: typeof BaseModalText;
  Actions: typeof BaseModalActions;
  Button: typeof BaseModalButton;
};

const BaseModal = BaseModalRoot as BaseModalCompound;

BaseModal.Content = BaseModalContent;
BaseModal.Title = BaseModalTitle;
BaseModal.Text = BaseModalText;
BaseModal.Actions = BaseModalActions;
BaseModal.Button = BaseModalButton;

export default BaseModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacingSpacing16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: dimOverlayDefault,
    opacity: 0.2,
  },
  card: {
    backgroundColor: backgroundColorWhite,
    borderRadius: radiusRadius16,
    paddingHorizontal: spacingSpacing20,
    paddingTop: spacingSpacing24,
    paddingBottom: spacingSpacing16,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingSpacing24,
  },
  title: {
    color: typoColorPrimary,
    textAlign: 'center',
    marginBottom: spacingSpacing12,
  },
  text: {
    color: typoColorPrimary,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacingSpacing12,
  },
  button: {
    flex: 1,
    minHeight: 42,
    borderRadius: radiusRadius8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacingSpacing16,
    paddingVertical: spacingSpacing16,
  },
  primaryButton: {
    backgroundColor: buttonColorCta,
  },
  secondaryButton: {
    backgroundColor: buttonColorSecondary,
  },
  fullWidthButton: {
    flex: 0,
    width: '100%',
  },
  primaryButtonText: {
    color: backgroundColorWhite,
  },
  secondaryButtonText: {
    color: typoColorPrimary,
  },
});
