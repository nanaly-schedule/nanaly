import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { typoColorPrimary } from '@/src/init/styles/tokens';

import CheckIcon from '../assets/CheckIcon';
import LeftArrowIcon from '../assets/LeftArrowIcon';
import NText from './NText';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showCheckIcon?: boolean;
  onPressCheckIcon?: () => void;
}

export default function Header({
  title,
  showBackButton = true,
  showCheckIcon = false,
  onPressCheckIcon,
}: HeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {showBackButton && (
        <Pressable
          style={[styles.btn, styles.left]}
          onPress={() => router.back()}
        >
          <LeftArrowIcon size={20} color={typoColorPrimary} />
        </Pressable>
      )}
      <NText variant="b16" style={styles.text}>
        {title}
      </NText>
      {showCheckIcon && (
        <Pressable
          style={[styles.btn, styles.right]}
          onPress={onPressCheckIcon}
        >
          <CheckIcon size={30} color={typoColorPrimary} />
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
