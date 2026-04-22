import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import CheckedIcon from '../assets/CheckedIcon';
import UncheckedIcon from '../assets/UncheckedIcon';
import NText from './NText';
import { typoColorPrimary, typoColorSub1 } from '@/src/init/styles/tokens';

interface CheckBoxProps {
  label?: string;
  isActive: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export default function CheckBox({ label, isActive, onPress }: CheckBoxProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {isActive ? <CheckedIcon size={24} /> : <UncheckedIcon size={24} />}
      {label && (
        <NText
          variant="m14"
          style={{ color: isActive ? typoColorPrimary : typoColorSub1 }}
        >
          {label}
        </NText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
