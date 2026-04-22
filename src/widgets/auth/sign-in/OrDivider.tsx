import { StyleSheet, View } from 'react-native';

import {
  borderDividerPrimary,
  spacingSpacing8,
  typoColorSub1,
} from '@/src/init/styles/tokens';
import NText from '@/src/shared/ui/NText';

export default function OrDivider() {
  return (
    <View style={styles.divider}>
      <View style={styles.border} />
      <NText variant="m12" style={styles.text}>
        또는
      </NText>
      <View style={styles.border} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    flexShrink: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: spacingSpacing8,
  },
  border: {
    backgroundColor: borderDividerPrimary,
    height: 1,
    flex: 1,
  },
  text: {
    color: typoColorSub1,
  },
});
