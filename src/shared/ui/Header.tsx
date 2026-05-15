import { useRouter } from 'expo-router';
import { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { typoColorPrimary } from '@/src/init/styles/tokens';

import CheckIcon from '../assets/CheckIcon';
import LeftArrowIcon from '../assets/LeftArrowIcon';
import NText from './NText';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onPressBack?: () => void;
  onPressCheckIcon?: () => void;
  children?: ReactNode;
}

export default function Header({
  title,
  showBackButton = true,
  onPressBack,
  onPressCheckIcon,
  children,
}: HeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {showBackButton && (
        <Pressable
          style={[styles.btn, styles.left]}
          onPress={() => {
            if (onPressBack) {
              onPressBack();
            } else {
              router.back();
            }
          }}
        >
          <LeftArrowIcon size={20} color={typoColorPrimary} />
        </Pressable>
      )}
      <NText variant="b16" style={styles.text}>
        {title}
      </NText>
      {children && (
        <Pressable
          style={[styles.btn, styles.right]}
          onPress={onPressCheckIcon}
        >
          {children as React.ReactNode}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    height: 48,
  },
  btn: {
    position: 'absolute',
    marginVertical: 'auto',
    top: 12,
    bottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  left: {
    left: 2,
  },
  text: {
    color: typoColorPrimary,
    margin: 'auto',
  },
  right: {
    right: 2,
    top: 8,
  },
});
