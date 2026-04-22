import { Pressable, StyleSheet, View } from 'react-native';
import NText from './NText';
import LeftArrowIcon from '../assets/LeftArrowIcon';
import { typoColorPrimary } from '@/src/init/styles/tokens';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable style={styles.btn} onPress={() => router.back()}>
        <LeftArrowIcon size={20} color={typoColorPrimary} />
      </Pressable>
      <NText variant="b16" style={styles.text}>
        {title}
      </NText>
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
    inset: 12,
    left: 18,
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  text: {
    color: typoColorPrimary,
    margin: 'auto',
  },
});
