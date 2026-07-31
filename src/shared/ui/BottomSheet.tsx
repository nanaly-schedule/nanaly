import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {
  backgroundColorPrimary,
  dimOverlayDefault,
  dimOverlayLight,
  radiusRadius20,
} from '@/src/init/styles/tokens';

interface BottomSheetProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
  showHandle?: boolean;
  showBackdrop?: boolean;
  backdropVariant?: 'default' | 'light' | 'none';
  handleStyle?: StyleProp<ViewStyle>;
  resizable?: boolean;
  minHeight?: number;
  initialHeight?: number;
  maxHeight?: number;
}

export default function BottomSheet({
  visible,
  children,
  onClose,
  style,
  showHandle = true,
  showBackdrop = true,
  backdropVariant,
  handleStyle,
  resizable = false,
  minHeight = 360,
  initialHeight,
  maxHeight,
}: BottomSheetProps) {
  const resolvedBackdropVariant =
    backdropVariant ?? (showBackdrop ? 'default' : 'none');
  const { height: windowHeight } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const resolvedMaxHeight = Math.max(
    minHeight,
    Math.min(maxHeight ?? windowHeight * 0.9, windowHeight),
  );
  const resolvedInitialHeight = Math.min(
    Math.max(initialHeight ?? minHeight, minHeight),
    resolvedMaxHeight,
  );
  const [sheetHeight, setSheetHeight] = useState(resolvedInitialHeight);
  const sheetHeightRef = useRef(resolvedInitialHeight);
  const dragStartHeight = useRef(resolvedInitialHeight);
  const sheetProgress = useRef(new Animated.Value(1)).current;
  const resizePanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          resizable && Math.abs(gestureState.dy) > 2,
        onPanResponderGrant: () => {
          dragStartHeight.current = sheetHeightRef.current;
        },
        onPanResponderMove: (_, gestureState) => {
          const nextHeight = dragStartHeight.current - gestureState.dy;
          const clampedHeight = Math.min(
            Math.max(nextHeight, minHeight),
            resolvedMaxHeight,
          );

          sheetHeightRef.current = clampedHeight;
          setSheetHeight(clampedHeight);
        },
      }),
    [minHeight, resizable, resolvedMaxHeight],
  );

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );
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

    sheetHeightRef.current = resolvedInitialHeight;
    setSheetHeight(resolvedInitialHeight);
    sheetProgress.setValue(1);
    Animated.timing(sheetProgress, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [resolvedInitialHeight, sheetProgress, visible]);

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
        <Pressable
          style={[
            styles.backdrop,
            resolvedBackdropVariant === 'light' && styles.lightBackdrop,
            resolvedBackdropVariant === 'none' && styles.transparentBackdrop,
          ]}
          onPress={onClose}
        />
        <KeyboardAvoidingView
          style={[
            styles.sheetContainer,
            Platform.OS === 'android' && { paddingBottom: keyboardHeight },
          ]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            <View
              style={[
                styles.sheet,
                style,
                resizable && {
                  height: sheetHeight,
                  minHeight,
                  maxHeight: resolvedMaxHeight,
                },
              ]}
            >
              {showHandle && (
                <View
                  style={styles.handleTouchArea}
                  {...(resizable ? resizePanResponder.panHandlers : {})}
                >
                  <View style={[styles.handle, handleStyle]} />
                </View>
              )}
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
  transparentBackdrop: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
  lightBackdrop: {
    backgroundColor: dimOverlayLight,
    opacity: 0.16,
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
  handleTouchArea: {
    alignSelf: 'stretch',
  },
});
